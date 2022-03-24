import { Router } from "express";
import { isValidObjectId } from "mongoose";
import NotificationController from "../controllers/NotificationController";
import Notification from "../models/Notification";
import NotificationService from "../services/NotificationService";
import isAdmin from "../middleware/isAdmin";

const notificationController = new NotificationController(Notification);
const notificationService = new NotificationService(Notification);

const notification = Router();

notification.get("/v1/notifications", async (req, res, next) => {
  const query = {
    to: req.query["to"]?.toString(),
    limit: Math.min(50, +(req.query["limit"] || 50)),
    before: req.query["before"]?.toString(),
  };
  if (query.before && !isValidObjectId(query.before)) {
    return res.status(400).json({ errors: ["before_id_invalid"] });
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
