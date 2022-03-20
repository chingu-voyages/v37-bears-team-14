import { pick } from "lodash";
import { Model } from "mongoose";
import { IProjectEvent } from "../models/ProjectEvent";

export interface ProjectEventsQueryParams {
  project?: string;
  types?: string[];
  before?: string;
  pageSize?: number;
}

class EventController {
  constructor(private projectEventModel: Model<IProjectEvent>) {}

  async getProjectEvents(params: ProjectEventsQueryParams) {
    const q: Record<string, any> = pick(params, ["project"]);
    if (params["types"]) {
      q["event"] = {
        $in: params["types"],
      };
    }
    if (params["before"]) {
      q["_id"] = {
        $lt: params["before"],
      };
    }
    const events = await this.projectEventModel
      .find(q)
      .sort({ _id: -1 })
      .limit(Math.min(50, params["pageSize"] || 50))
      .populate("project")
      .populate("user");
    return events;
  }
}

export default EventController;
