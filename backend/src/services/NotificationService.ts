import { Document, Model, ObjectId } from "mongoose";
import { INotification, INotificationData } from "../models/Notification";

export type NotificationDoc = INotification &
  Document<unknown, any, INotification>;

enum NotificationEventType {
  TEST = "test",
}

/**
 * Lightweight class responsible for event-to-data mapping.
 */
class NotificationService {
  constructor(private notificationModel: Model<INotification>) {}

  async notify(
    event: NotificationEventType,
    to: string,
    data: INotificationData
  ): Promise<NotificationDoc> {
    const notification = await this.notificationModel.create({
      to,
      isRead: false,
      event,
      data,
    });
    // TODO: Publish notification event.
    return notification;
  }

  async notifyTest(to: string, user: ObjectId): Promise<NotificationDoc> {
    return this.notify(NotificationEventType.TEST, to, { user });
  }
}

export default NotificationService;
