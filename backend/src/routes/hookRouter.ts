import { Router } from "express";
import HookController from "../controllers/HookController";
import Hook from "../models/Hook";
import Member from "../models/Member";
import logger from "../logger";
import { pick } from "lodash";
import ProjectEvent from "../models/ProjectEvent";
import UserController from "../controllers/UserController";
import User from "../models/User";
import isLoggedIn from "../middleware/isLoggedIn";

const userController = new UserController(User);
const hookController = new HookController(
  Hook,
  Member,
  ProjectEvent,
  userController
);

const hooks = Router();

hooks.post("/", isLoggedIn, async (req, res, next) => {
  if (!req.body["project"]) {
    return res.status(400).json({ errors: ["missing_project"] });
  }

  try {
    const hook = await hookController.create(
      req.user!.id,
      pick(req.body, ["project", "isActive"])
    );
    res.json(hook);
  } catch (err) {
    next(err);
  }
});

hooks.get("/", isLoggedIn, async (req, res, next) => {
  if (!req.query["project"]) {
    return res.status(400).json({ errors: ["missing_project"] });
  }

  try {
    const hooks = await hookController.lookup(
      req.user!._id!.toString(),
      req.query["project"].toString(),
      req.user!.isAdmin
    );
    res.json(hooks);
  } catch (err) {
    next(err);
  }
});

hooks.post("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const hook = await hookController.update(
      req.user!.id!.toString(),
      req.params["id"],
      pick(req.body, ["isActive"]),
      req.user!.isAdmin
    );
    res.json(hook);
  } catch (err) {
    next(err);
  }
});

hooks.post("/:id/rotate_secret", isLoggedIn, async (req, res, next) => {
  try {
    const hook = await hookController.rotateSecret(
      req.user!.id!.toString(),
      req.params["id"],
      req.user!.isAdmin
    );
    res.json(hook);
  } catch (err) {
    next(err);
  }
});

hooks.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const hook = await hookController.remove(
      req.user!.id!.toString(),
      req.params["id"],
      req.user!.isAdmin
    );
    res.json(hook);
  } catch (err) {
    next(err);
  }
});

// Note: Generic event callback handler.
//       How to specify the associated user in this situation?
// hooks.post("/:id/events", async (req, res, next) => {
//   // Do a best-effort guess at hmac sha256
//   const signature =
//     req.get("X-Hub-Signature-256") ||
//     req.get("X-Signature-256") ||
//     req.get("X-Signature");
//   if (!signature) {
//     return res.status(400).json({ errors: ["missing_x_hub_signature_256"] });
//   }
//   // Do a best-effort guess at the event name.
//   const eventName =
//   req.body["event"] ||
//     req.body["type"] ||
//     req.get("X-Event") ||
//     req.get("X-GitHub-Event") ||
//     "unknown";
// });

hooks.post("/:id/events/github", async (req, res, next) => {
  const signature = req.get("X-Hub-Signature-256");
  if (!signature) {
    return res.status(400).json({ errors: ["missing_x_hub_signature_256"] });
  }

  try {
    const start = Date.now();
    const event = await hookController.createEventGithub(
      req.params["id"],
      signature,
      "repo_" + (req.get("X-GitHub-Event") || "unknown"),
      req.body
    );
    const timeElapsedMs = Date.now() - start;

    logger.info("Processed hook events/github " + req.params["id"], {
      hookId: req.params["id"],
      timeElapsedMs,
      ...pick(req.headers, [
        "content-type",
        "User-Agent",
        "X-GitHub-Delivery",
        "X-GitHub-Event",
        "X-GitHub-Hook-ID",
        "X-GitHub-Hook-Installation-Target-ID",
        "X-GitHub-Hook-Installation-Target-Type",
        "X-Hub-Signature",
        "X-Hub-Signature-256",
      ]),
    });

    res.json(event);
  } catch (err) {
    next(err);
  }
});

export default hooks;
