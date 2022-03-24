import { FilterQuery, Model } from "mongoose";
import { INotification } from "../models/Notification";

export interface NotificationQueryParams {
  to?: string;
  limit?: number;
  before?: string;
}

class NotificationController {
  constructor(private notificationModel: Model<INotification>) {}

  async lookup(query: NotificationQueryParams) {
    const q: FilterQuery<INotification> = {};
    if (query.to) {
      q["to"] = query.to;
    }
    if (query.before) {
      q["_id"] = {
        $lt: query.before,
      };
    }
    return await this.notificationModel
      .find(query)
      .populate("data.project")
      .populate("data.user")
      .populate("data.application")
      .sort({ _id: -1 })
      .limit(Math.min(50, query.limit || 50));
  }
}

export default NotificationController;
