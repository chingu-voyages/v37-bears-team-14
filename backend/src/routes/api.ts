import { pick } from "lodash";
import { NextFunction, Request, Response, Router } from "express";
import { isValidObjectId } from "mongoose";
import NotFoundError from "../controllers/errors/NotFoundError";
import TechController from "../controllers/TechController";
import logger from "../logger";
import Tech from "../models/Tech";
import "../types/express";

/* Dependencies */

const techController = new TechController(Tech);

/* API routes */

const api = Router();

api.get("/v1/techs/:id", async (req, res, next) => {
  try {
    const tech = await techController.getById(req.params["id"]);
    res.json(tech);
  } catch (err) {
    next(err);
  }
});

api.post(
  "/v1/techs/:id",
  (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.status(401).json({ errors: ["unauthenticated"] });
    }
  },
  (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ errors: ["unauthorized"] });
    }
  },
  async (req, res, next) => {
    const update = pick(req.body, ["name", "description", "imageUrl"]);

    try {
      const tech = await techController.updateById(req.params["id"], update);
      res.json(tech);
    } catch (err) {
      next(err);
    }
  }
);

api.get("/v1/techs", async (req, res, next) => {
  const gt = req.query["gt"];
  const gtString = Array.isArray(gt) ? "" + gt[0] : "" + (gt || "");
  if ("" !== gtString && !isValidObjectId(gtString)) {
    return res.status(400).json({ errors: ["gt_invalid_id"] });
  }

  const pageSize = Math.max(50, +(req.query["pageSize"] || 50));
  try {
    const techs = await techController.lookup(pageSize, gtString);
    res.json(techs);
  } catch (err) {
    next(err);
  }
});

api.get("/v1/search/techs", async (req, res, next) => {
  const q = req.query["q"];
  const qString = Array.isArray(q) ? "" + q[0] : "" + (q || "");

  try {
    const techs = await techController.search(qString);
    res.json(techs);
  } catch (err) {
    next(err);
  }
});

// Error handler for API routes! Must come _after_ the other endpoints!
api.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  if (err instanceof NotFoundError) {
    res.status(404).json({ errors: ["id_not_found"] });
  } else {
    logger.error("Unrecognized error " + err.message, err);
    res.status(500).json({ errors: ["internal_server_error"] });
  }
});

export default api;
