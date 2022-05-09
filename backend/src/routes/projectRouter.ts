import { Request, Router } from "express";
import { pick } from "lodash";
import { isValidObjectId, startSession } from "mongoose";
import ProjectController, {
  ProjectUpdateParams,
} from "../controllers/ProjectController";
import Member from "../models/Member";
import Project from "../models/Project";
import Comment from "../models/Comment";
import User from "../models/User";
import Tech from "../models/Tech";
import Search from "../models/Search";

/* dependencies */
const projectController = new ProjectController(
  Project,
  User,
  Member,
  Comment,
  Tech,
  Search,
  () => startSession()
);

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
//add comment
projects.post("/v1/projects/:id/comment", async (req: Request, res, next) => {
  await projectController.addComment(req.body);
  return res.json(req.body);
});
//edit comment
projects.post(
  "/v1/projects/:id/comment/edit",
  async (req: Request, res, next) => {
    await projectController.editComment(req.body);
    return res.json(req.body);
  }
);
//delete comment
projects.post(
  "/v1/projects/:id/comment/delete",
  async (req: Request, res, next) => {
    await projectController.deleteComment(req.body);
    return res.json(req.body);
  }
);
//like comment
projects.post(
  "/v1/projects/:id/comment/like",
  async (req: Request, res, next) => {
    await projectController.likeComment(req.body.comment, req.body.user);
    return res.json(req.body);
  }
);
//dislike comment
//get project's comments
projects.get("/v1/projects/:id/comments", async (req: Request, res, next) => {
  const comments = await projectController.getComments(req.params["id"]);

  res.json(comments);
});

// Star Project
projects.post("/v1/projects/:id/star", async (req: Request, res, next) => {
  await projectController.addStarrer(req.body.user.id, req.body.project);
  res.json({ ok: true });
});

// Unstar Project
projects.post("/v1/projects/:id/unstar", async (req: Request, res, next) => {
  await projectController.removeStarrer(req.body.user.id, req.body.project);
  res.json({ ok: true });
});
//Get Starred Projects
projects.get("/v1/projects/get-starred", async (req: Request, res, next) => {
  let starred;
  if (req.query["user"])
    starred = await projectController.getStarred(req.query["user"].toString());
  return res.json(starred);
});

projects.get("/v1/projects/:id", async (req, res, next) => {
  try {
    const project = await projectController.getById(req.params["id"]);
    res.json(project);
  } catch (err) {
    next(err);
  }
});
//Get single project by name
projects.get("/v1/project_lookup/:name", async (req, res, next) => {
  try {
    const project = await projectController.getByName(req.params["name"]);
    res.json(project);
  } catch (err) {
    next(err);
  }
});
//search projects by name and description
projects.get("/v1/project_search", async (req, res, next) => {
  if (req.query["search"]) {
    try {
      const project = await projectController.searchProjects(
        req.query["search"].toString(),
        req.user?.id
      );

      res.json(project);
    } catch (err) {
      next(err);
    }
  } else {
    res.status(400).json({ errors: ["missing_search"] });
  }
});

projects.get("/v1/projects/:id/members", async (req, res, next) => {
  try {
    const members = await projectController.getMembers(req.params["id"]);
    res.json(members);
  } catch (err) {
    next(err);
  }
});

/**
 * Returns the session user's membership with the project.
 */
projects.get(
  "/v1/projects/:id/members/@me",
  (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.status(401).json({ errors: ["unauthenticated"] });
    }
  },
  async (req, res, next) => {
    const projectId = req.params["id"];
    const userId = req.user!._id!.toString();
    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ errors: ["project_id_invalid"] });
    }
    try {
      const member = await projectController.getMemberByUserId(
        projectId,
        userId
      );
      res.json(member);
    } catch (err) {
      next(err);
    }
  }
);
//Return x number of recent projects
projects.get("/v1/projects", async (req, res, next) => {
  const pageSize = Math.max(50, +(req.query["pageSize"] || 50));
  const projects = await projectController.lookup(pageSize);
  res.json(projects);
});

// Returns users' projects
projects.get("/v1/members", async (req: Request, res, next) => {
  // return an error early if this is missing
  if (!req.query["user"]) {
    return res.status(400).json({ errors: ["missing_user"] });
  }

  try {
    const userId = req.query["user"];
    const userMembers = await projectController.findUserProjects(
      userId.toString()
    );
    res.json(userMembers);
  } catch (err) {
    next(err);
  }
});

projects.post(
  "/v1/projects/:id/members",
  (req: Request, res, next) => {
    if (req.user) {
      next();
    } else {
      res.status(401).json({ errors: ["unauthenticated"] });
    }
  },
  async (req, res, next) => {
    const user = req.user!;
    const updaterUserId: string = user._id!.toString();

    if (!isValidObjectId(req.body["user"])) {
      return res.status(400).json({ errors: ["user_id_invalid"] });
    }

    try {
      const member = await projectController.updateMember(
        req.params["id"],
        updaterUserId,
        pick(req.body, ["user", "roleName"]),
        user.isAdmin
      );
      res.json(member);
    } catch (err) {
      next(err);
    }
  }
);

// NOTE: On successful removal, the returned response
// is the member data record BEFORE the deletion.
projects.delete(
  "/v1/projects/:id/members",
  (req: Request, res, next) => {
    if (req.user) {
      next();
    } else {
      res.status(401).json({ errors: ["unauthenticated"] });
    }
  },
  async (req, res, next) => {
    const user = req.user!;
    const updaterUserId: string = user._id!.toString();

    if (!isValidObjectId(req.body["user"])) {
      return res.status(400).json({ errors: ["user_id_invalid"] });
    }

    try {
      const member = await projectController.removeMember(
        req.params["id"],
        updaterUserId,
        req.body["user"],
        user.isAdmin
      );
      res.json(member);
    } catch (err) {
      next(err);
    }
  }
);

//Returns user projects that use a tech
projects.get("/v1/users/:userId/projects", async (req, res, next) => {
  if (req.query["techId"]) {
    const userId = req.params.userId;
    const techId = req.query["techId"];
    const userMembers = await projectController.findUserProjectsByTech(
      userId.toString(),
      techId.toString()
    );
    res.json(userMembers);
  } else {
    res.status(400).json({ errors: ["techId_missing"] });
  }
});

export default projects;
