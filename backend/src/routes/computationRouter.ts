import { Router } from "express";
import { pick } from "lodash";
import ComputationTrendingSearchController from "../controllers/ComputationTrendingSearchController";
import logger from "../logger";
import isAuthenticatedJobToken from "../middleware/isAuthenticatedJobToken";
import Search from "../models/Search";
import Tech from "../models/Tech";

/* dependencies */

const computationTrendingSearchController =
  new ComputationTrendingSearchController(Search, Tech);

const computations = Router();

computations.post(
  "/v1/computations/trendingsearches",
  isAuthenticatedJobToken,
  async (req, res, next) => {
    try {
      logger.info("Triggered computation trendingsearches");
      const result =
        await computationTrendingSearchController.triggerComputationTrendingSearch(
          pick(req.body, ["maxAnalyzed", "batchSize"])
        );
      res.json(result);
    } catch (err: any) {
      logger.error("ComputationTrendingSearch FAILED!! " + err.message);
      next(err);
    }
  }
);

computations.get(
  "/v1/computations/trendingsearches/latest",
  async (req, res, next) => {
    try {
      const result = await computationTrendingSearchController.getLatest();
      res.json(result);
    } catch (err: any) {
      next(err);
    }
  }
);

export default computations;
