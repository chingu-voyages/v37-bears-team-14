import { Request, Router } from "express";
import { pick } from "lodash";
import { isValidObjectId, startSession } from "mongoose";
import ProjectController, { ProjectUpdateParams } from "../controllers/ProjectController";
import Member from "../models/Member";
import Project from "../models/Project";
import User from "../models/User";

/* dependencies */
const projectController = new ProjectController(Project, User, Member, () => startSession())

const projects = Router();

/**
 * The owner is defaulted to the session's user.
 * request parameters:
 * - name: (required) name of the project
 * - description: (optional) description of the project
 * - techs: (optional) array of Tech Stack IDs
 */
projects.post(
  "/v1/projects",
  (req: Request, res, next) => {
    if (req.user) {
      next();
    } else {
      res.status(401).json({ errors: ["unauthenticated"] });
    }
  },
  async (req: Request, res, next) => {
    const firstOwnerId: string = req.user!._id!.toString();
    const params: ProjectUpdateParams = pick(req.body, [
      "name",
      "description",
      "techs",
    ]);

    const errors = [];
    if (!params.name) {
      errors.push("name_missing");
    } else if (params.name.length < 1) {
      errors.push("name_too_short");
    }

    if (undefined !== params.techs) {
      if (!Array.isArray(params.techs)) {
        errors.push("techs_not_array");
      } else if (params.techs.some((t) => !isValidObjectId(t))) {
        errors.push("techs_id_invalid");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const project = await projectController.create(params, firstOwnerId);
      res.json(project);
    } catch (err) {
      next(err);
    }
  }
);

projects.post(
  "/v1/projects/:id",
  (req: Request, res, next) => {
    if (req.user) {
      next();
    } else {
      res.status(401).json({ errors: ["unauthenticated"] });
    }
  },
  async (req: Request, res, next) => {
    const updaterUserId: string = req.user!._id!.toString();
    const isAdmin = req.user!.isAdmin;
    const projectId = req.params["id"];
    const params: ProjectUpdateParams = pick(req.body, [
      "name",
      "description",
      "techs",
    ]);

    const errors = [];
    if (undefined !== params.name && params.name.length < 1) {
      errors.push("name_too_short");
    }

    if (undefined !== params.techs) {
      if (!Array.isArray(params.techs)) {
        errors.push("techs_not_array");
      } else if (params.techs.some((t) => !isValidObjectId(t))) {
        errors.push("techs_id_invalid");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const project = await projectController.update(
        projectId,
        updaterUserId,
        params,
        isAdmin
      );
      res.json(project);
    } catch (err) {
      next(err);
    }
  }
);

projects.get("/v1/projects/:id", async (req, res, next) => {
  try {
    const project = await projectController.getById(req.params["id"]);
    res.json(project);
  } catch (err) {
    next(err);
  }
});

projects.get("/v1/project_lookup/:name", async (req, res, next) => {
  try {
    const project = await projectController.getByName(req.params["name"]);
    res.json(project);
  } catch (err) {
    next(err);
  }
});

export default projects;
