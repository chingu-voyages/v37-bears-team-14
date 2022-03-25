import { Router } from "express";
import { isValidObjectId } from "mongoose";
import NotificationController from "../controllers/NotificationController";
import Notification from "../models/Notification";
import { NotificationDoc } from "../messaging/NotificationService";
import isAdmin from "../middleware/isAdmin";
import isLoggedIn from "../middleware/isLoggedIn";
import { mustGetConfig } from "../config";
import {
  getNotificationConsumer,
  getNotificationService,
} from "../messaging/setup";
import logger from "../logger";

/* dependency setup */
const config = mustGetConfig(process.env);
const notificationConsumer = getNotificationConsumer();
const notificationService = getNotificationService();
const notificationController = new NotificationController(Notification);

/* router */
const notification = Router();

// Reference: https://www.digitalocean.com/community/tutorials/nodejs-server-sent-events-build-realtime-app
// The "data:" prefixes the message data field.
// Messages MUST end in 2 newlines.
const createSseMessage = (message: object) => {
  return "data: " + JSON.stringify(message) + "\n\n";
};

notification.get("/v1/streams/notifications", isLoggedIn, async (req, res) => {
  if (!config.kafkaEnabled || !notificationConsumer) {
    return res
      .status(503)
      .json({ errors: ["notification_service_unavailable"] });
  }

  const to = req.query["to"] || req.user?._id?.toString();
  if (!to) {
    return res.status(400).json({ errors: ["to_missing"] });
  }

  const requestId = Date.now() + ("" + Math.random()).slice(-6);

  const headers: Record<string, string> = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
    "Request-ID": requestId,
  };

  // In development, the frontend will bypass the create-react-app
  // proxy and connect directly from a different port.
  if (config.nodeEnv === "development") {
    headers["Access-Control-Allow-Origin"] = "http://localhost:3000";
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  res.writeHead(200, headers);

  const handler = (notification: NotificationDoc) => {
    res.write(createSseMessage(notification.toJSON()));
  };

  notificationConsumer.addListener(to.toString(), handler);
  logger.info(`Added notification listener to=${to} requestId=${requestId}`);

  req.on("close", () => {
    notificationConsumer.removeListener(to.toString(), handler);
    logger.info(
      `Removed notification listener to=${to} requestId=${requestId}`
    );
  });

  // Send an initial ping.
  res.write("");
});

notification.get("/v1/notifications", isLoggedIn, async (req, res, next) => {
  const query = {
    to: req.query["to"]?.toString(),
    limit: Math.min(50, +(req.query["limit"] || 50)),
    before: req.query["before"]?.toString(),
  };

  if (query.before && !isValidObjectId(query.before)) {
    return res.status(400).json({ errors: ["before_id_invalid"] });
  }
  if (!req.user!.isAdmin) {
    if (!query.to) {
      return res.status(400).json({ errors: ["to_missing"] });
    } else if (query.to !== req.user!.id.toString()) {
      return res.status(403).json({ errors: ["unauthorized"] });
    }
  }

  try {
    const notifications = await notificationController.lookup(query);
    res.json(notifications);
  } catch (err) {
    next(err);
  }
});

notification.post(
  "/v1/admin/notifications/sendtest",
  isAdmin,
  async (req, res, next) => {
    if (!isValidObjectId(req.body.to)) {
      return res.status(400).json({ errors: ["to_id_invalid"] });
    }
    try {
      const notification = await notificationService.notifyTest(
        req.body.to,
        req.user!.id
      );
      res.json(notification);
    } catch (err) {
      next(err);
    }
  }
);

export default notification;
