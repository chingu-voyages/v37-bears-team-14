import { Document, Model } from "mongoose";
import logger from "../logger";
import { ISearch } from "../models/Search";
import { ObjectId } from "mongodb";
import ComputationTrendingSearch, {
  IComputationTrendingSearch,
} from "../models/ComputationTrendingSearch";
import { ITech } from "../models/Tech";
import { pick } from "lodash";

const DEFAULT_MAX_ANALYZED = 5000;
const DEFAULT_BATCH_SIZE = 200;

interface TriggerParams {
  maxAnalyzed: number;
  batchSize: number;
}

interface TriggerResult {
  status: string;
}

interface ComputationState {
  techCount: Record<string, number>;
}

interface ComputationResult {
  state: ComputationState;
  end: ObjectId;
  start: ObjectId;
  analyzed: number;
  maxAnalyzed: number;
}

const newComputationState = (): ComputationState => {
  return {
    techCount: {},
  };
};

export type SearchDoc = ISearch & Document<unknown, any, ISearch>;

/**
 * The two main methods are:
 * - triggerComputationTrendingSearch (called by cron job)
 * - getLatest (for fetching the latest results)
 *
 * triggerComputationTrendingSearch iterates through the latest Search
 * records and scores a search query based on:
 * - The number of Techs matched by the search query.
 *
 * We make use of the fact that ObjectId contains a timestamp to find
 * the latest Search records.
 *
 * In production, a cron job must be set up to call this endpoint periodically.
 * For example, cron-job.org is a service that can call an endpoint every 15 minutes.
 */
class ComputationTrendingSearchController {
  constructor(
    private searchModel: Model<ISearch>,
    private techModel: Model<ITech>
  ) {}

  async getLatest(): Promise<IComputationTrendingSearch | null> {
    return await ComputationTrendingSearch.findOne().sort({ _id: -1 });
  }

  // This method kicks off the computation to run at the end of the event loop
  // and returns early.
  async triggerComputationTrendingSearch(
    params: Partial<TriggerParams>
  ): Promise<TriggerResult> {
    setTimeout(() =>
      this.computeTrendingSearchSafe({
        maxAnalyzed: DEFAULT_MAX_ANALYZED,
        batchSize: DEFAULT_BATCH_SIZE,
        ...params,
      })
    );
    return { status: "ok" };
  }

  // This method should never throw! Log any errors and move on!
  private async computeTrendingSearchSafe(params: TriggerParams) {
    try {
      const start = Date.now();
      const result = await this.analyzeLatestSearches(
        params.maxAnalyzed,
        params.batchSize
      );
      const suggestions = await this.createSuggestions(result);
      const timeElapsedMs = Date.now() - start;
      const computation = await ComputationTrendingSearch.create({
        suggestions,
        timeElapsedMs,
        ...pick(result, ["start", "end", "analyzed", "maxAnalyzed"]),
      });
      logger.info("Completed computation trendingsearches", {
        computation: computation.toJSON(),
        params,
      });
    } catch (err: any) {
      logger.error("Failed to compute trending searches!! " + err.message);
    }
  }

  private async createSuggestions(result: ComputationResult) {
    const techIds = Object.keys(result.state.techCount);
    const techs = techIds.sort((a, b) => {
      // Sort descending.
      return result.state.techCount[b] - result.state.techCount[a];
    });
    const top50 = await this.techModel.find({
      _id: { $in: techs.slice(0, 50) },
    });

    return top50
      .map((tech) => {
        return {
          query: tech.name,
          score: result.state.techCount[tech._id.toString()],
        };
      })
      .sort((a, b) => b.score - a.score);
  }

  private async analyzeLatestSearches(
    maxAnalyzed: number,
    batchSize: number
  ): Promise<ComputationResult> {
    let analyzed = 0;
    let start = await this.getStartingCursor();
    let cursor = start;
    let state = newComputationState();

    while (true) {
      const searches = await this.searchModel
        .find({ _id: { $lt: cursor } })
        .sort({ _id: -1 })
        .limit(batchSize);

      // If searches are exhausted, finish.
      if (searches.length < 1) {
        return {
          state,
          end: cursor,
          start,
          analyzed,
          maxAnalyzed,
        };
      }

      for (const search of searches) {
        this.updateState(state, search);
        analyzed += 1;
        cursor = search._id;

        // If we've completed analysis, don't continue.
        if (analyzed >= maxAnalyzed) {
          return {
            state,
            end: cursor,
            start,
            analyzed,
            maxAnalyzed,
          };
        }
      }
    }
  }

  private updateState(state: ComputationState, search: SearchDoc) {
    // TODO: In the future, one evaluate more criteria based on project name or description here.

    // Don't add matched techs if they weren't a part of any project!
    if (search.techMatchesProjects.length < 1) {
      return;
    }

    for (const tech of search.matchedTechs) {
      const key = tech.toString();
      state.techCount[key] = (state.techCount[key] || 0) + 1;
    }
  }

  private async getStartingCursor(): Promise<ObjectId> {
    const latest = await this.searchModel
      .findOne({})
      .limit(1)
      .sort({ _id: -1 });
    if (latest) {
      // Add one to the timestamp to include the latest document in the start.
      return new ObjectId(latest._id.getTimestamp().getTime() / 1000 + 1);
    } else {
      return new ObjectId(new Date().getTime() / 1000);
    }
  }
}

export default ComputationTrendingSearchController;
