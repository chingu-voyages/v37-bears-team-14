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

hooks.post("/:id/events", async (req, res, next) => {
  const signature = req.get("X-Hub-Signature-256");
  if (!signature) {
    return res.status(400).json({ errors: ["missing_x_hub_signature_256"] });
  }

  try {
    const start = Date.now();
    const event = await hookController.createEvent(
      req.params["id"],
      req.get("X-GitHub-Event") || "unknown",
      signature,
      req.body
    );
    const timeElapsedMs = Date.now() - start;

    logger.info("Processed hook event " + req.params["id"], {
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
