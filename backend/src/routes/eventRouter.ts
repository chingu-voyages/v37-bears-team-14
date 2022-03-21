import { Router } from "express";
import { pick } from "lodash";
import { isValidObjectId } from "mongoose";
import EventController from "../controllers/EventController";
import logger from "../logger";
import ProjectEvent from "../models/ProjectEvent";

const eventController = new EventController(ProjectEvent);

const events = Router();

/**
 * Example:
 * GET /api/v1/events/projectevents?project=123&types=update,create&before=124&pageSize=2
 */
events.get("/v1/events/projectevents", async (req, res, next) => {
  const params: Record<string, any> = pick(req.query, [
    "project",
    "types",
    "before",
    "pageSize",
  ]);

  if (params["project"] && !isValidObjectId(params["project"])) {
    return res.status(400).json({ errors: ["project_id_invalid"] });
  } else if (params["before"] && !isValidObjectId(params["before"])) {
    return res.status(400).json({ errors: ["before_id_invalid"] });
  }

  if (params["types"]) {
    const types = params["types"];
    if (Array.isArray(types)) {
      params["types"] = types.map((t) => t.toString());
    } else {
      params["types"] = types
        .toString()
        .split(",")
        .filter((s: string) => s !== "");
    }
  }

  if (params["pageSize"]) {
    params["pageSize"] = +params["pageSize"].toString();
  }

  try {
    const events = await eventController.getProjectEvents(
      pick(params, ["project", "types", "before", "pageSize"])
    );
    const eventsJson = events.map((event) => {
      const json = event.toJSON();
      try {
        json.payload = JSON.parse(json.payload);
      } catch (err) {
        logger.error("Failed to parse JSON payload!!", {
          payload: json.payload,
        });
      }
      return json;
    });

    res.json(eventsJson);
  } catch (err) {
    next(err);
  }
});

export default events;
