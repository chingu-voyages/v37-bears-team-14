import { Request, Router } from "express";
import { pick } from "lodash";
import { isValidObjectId, startSession } from "mongoose";
import ApplicationController, {
  LookupProjectApplicationsParams,
  LookupUserApplicationsParams,
} from "../controllers/ApplicationController";
import isLoggedIn from "../middleware/isLoggedIn";
import Application from "../models/Application";
import Member from "../models/Member";
import Project from "../models/Project";
import User from "../models/User";

/* dependencies */
const applicationController = new ApplicationController(
  Application,
  Project,
  User,
  Member
);

const applications = Router();

applications.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const application = await applicationController.createApplication(
      req.user!._id!.toString(),
      pick(req.body, ["project", "user", "content"])
    );
    res.json(application);
  } catch (err) {
    next(err);
  }
});

// ?project=<project ID>
// ?user=<user ID>
// project and user are mutually exclusive
applications.get("/", isLoggedIn, async (req, res, next) => {
  if (!req.query["user"] && !req.query["project"]) {
    return res.status(400).json({ errors: ["missing_project_or_user"] });
  }

  if (req.query["user"] && req.query["project"]) {
    return res
      .status(400)
      .json({ errors: ["mutually_exclusive_project_user"] });
  }

  const gt = req.query["gt"];
  const gtString = Array.isArray(gt) ? "" + gt[0] : "" + (gt || "");
  if ("" !== gtString && !isValidObjectId(gtString)) {
    return res.status(400).json({ errors: ["gt_invalid_id"] });
  }

  try {
    const query:
      | LookupProjectApplicationsParams
      | LookupUserApplicationsParams = {
      ...(req.query["user"]
        ? { user: "" + req.query["user"] }
        : { project: "" + req.query["project"] }),
    };

    if (req.query["status"]) {
      query["status"] = "" + req.query["status"];
    }

    const applications = await applicationController.lookup(
      req.user!._id!.toString(),
      query,
      Math.min(50, +(req.query["pageSize"] || 50)),
      gtString
    );
    res.json(applications);
  } catch (err) {
    next(err);
  }
});

applications.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const application = await applicationController.getById(req.params["id"]);
    res.json(application);
  } catch (err) {
    next(err);
  }
});

applications.post("/:id", isLoggedIn, async (req, res, next) => {
  if (!isValidObjectId(req.params["id"])) {
    return res.status(400).json({ errors: ["application_id_invalid"] });
  }

  if (
    req.body.status &&
    !["pending", "accepted", "closed"].includes(req.body.status)
  ) {
    return res.status(400).json({ errors: ["invalid_status"] });
  }

  try {
    const application = await applicationController.updateApplication(
      req.params["id"],
      req.user!._id!.toString(),
      pick(req.body, ["status", "content", "requestedRole"])
    );
    res.json(application);
  } catch (err) {
    next(err);
  }
});

export default applications;
