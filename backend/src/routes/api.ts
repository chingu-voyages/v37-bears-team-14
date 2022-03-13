import { pick } from "lodash";
import { NextFunction, Request, Response, Router } from "express";
import { isValidObjectId, startSession } from "mongoose";
import NotFoundError from "../controllers/errors/NotFoundError";
import TechController from "../controllers/TechController";
import UserController, {
  ProfileUpdateParams,
} from "../controllers/UserController";
import logger from "../logger";
import Tech from "../models/Tech";
import User from "../models/User";
import "../types/express";
import UnexpectedError from "../controllers/errors/UnexpectedError";
import UnauthorizedError from "../controllers/errors/UnauthorizedError";
import FieldExistsError from "../controllers/errors/FieldExistsError";
import InvalidChangeLastOwner from "../controllers/errors/InvalidChangeLastOwner";
import computationRouter from "./computationRouter";
import projectRouter from "./projectRouter";
import applicationRouter from "./applicationRouter";
import hookRouter from "./hookRouter";
import MemberAlreadyExistsError from "../controllers/errors/MemberAlreadyExistsError";
import PendingApplicationExistsError from "../controllers/errors/PendingApplicationExistsError";

/* Dependencies */

const techController = new TechController(Tech);
const userController = new UserController(User);
/* API routes */

const api = Router();

// COMPUTATION

api.use(computationRouter);

// PROJECT

api.use(projectRouter);

// APPLICATION

api.use("/v1/applications", applicationRouter);

// HOOKS

api.use("/v1/hooks", hookRouter);

// TECH

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
api.get("/v1/search/:username", async (req, res, next) => {
  try {
    const user = await userController.searchByName(req.params["username"]);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

api.get("/v1/users/:id", async (req, res, next) => {
  try {
    const user = await userController.searchById(req.params["id"]);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

api.post(
  "/v1/users/:id",
  async (req: Request, res, next) => {
    if (req.user?.id.toString() == req.params["id"]) {
      next();
    } else {
      res.status(401).json({ errors: ["unauthenticated"] });
    }
  },
  async (req: Request, res, next) => {
    const userId: string = req.user!._id!.toString();
    const params: ProfileUpdateParams = pick(req.body, [
      "username",
      "displayName",
      "techs",
    ]);

    const errors = [];
    if (!params.username && !params.techs && !params.displayName) {
      errors.push("username_missing_and_techs_missing_and_displayname_missing");
    } else if (params.username && params.username.length < 1) {
      errors.push("usernamename_too_short");
    }

    if (undefined !== params.techs) {
      if (!Array.isArray(params.techs)) {
        errors.push("techs_not_array");
      } else if (params.techs.some((t) => !isValidObjectId(t))) {
        errors.push("techs_id_invalid");
      }
    }

    if (params.username) {
      try {
        const checkName = await userController.findDuplicate(params.username);
        if (checkName) {
          errors.push("Username already taken");
        }
      } catch (err) {
        next(err);
      }
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const profile = await userController.updateProfile(
        userId,
        req.params["id"],
        params
      );
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }
);

api.get("/v1/current-session", (req: Request, res: Response) => {
  res.json({
    user: req.user,
    isLoggedIn: !!req.user,
  });
});

// Error handler for API routes! Must come _after_ the other endpoints!
api.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof NotFoundError) {
    res.status(404).json({ errors: [`${err.resource}_not_found`] });
  } else if (err instanceof UnauthorizedError) {
    res.status(403).json({ errors: ["unauthorized"] });
  } else if (err instanceof FieldExistsError) {
    res.status(400).json({ errors: [`${err.field}_already_exists`] });
  } else if (err instanceof InvalidChangeLastOwner) {
    res.status(400).json({ errors: ["invalid_change_last_owner"] });
  } else if (err instanceof MemberAlreadyExistsError) {
    res.status(400).json({ errors: ["member_already_exists"] });
  } else if (err instanceof PendingApplicationExistsError) {
    res.status(400).json({ errors: ["pending_application_already_exists"] });
  } else if (err instanceof UnexpectedError) {
    logger.error("Unexpected error " + err.message, err);
    res.status(500).json({ errors: ["internal_server_error"] });
  } else {
    logger.error("Unrecognized error " + err.message, err);
    res.status(500).json({ errors: ["internal_server_error"] });
  }
});

export default api;
