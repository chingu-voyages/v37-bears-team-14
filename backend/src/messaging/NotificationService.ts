import { Producer } from "kafkajs";
import { Document, Model, ObjectId } from "mongoose";
import logger from "../logger";
import { INotification, INotificationData } from "../models/Notification";

export type NotificationDoc = INotification &
  Document<unknown, any, INotification>;

enum NotificationEventType {
  TEST = "test",
  APPLICATION_CREATED = "application_created",
}

export interface NotificationCreateParams {
  event: NotificationEventType;
  to: string;
  data: INotificationData;
}

/**
 * Lightweight class responsible for event-to-data mapping.
 */
class NotificationService {
  constructor(
    private notificationModel: Model<INotification>,
    private producer?: Producer,
    private topic?: string
  ) {}

  async notify(messages: NotificationCreateParams[]) {
    const notifications = await this.notificationModel.insertMany(
      messages.map((m) => ({
        ...m,
        isRead: false,
      }))
    );

    if (this.producer && this.topic) {
      const metadata = await this.producer.send({
        topic: this.topic,
        messages: notifications.map((n) => ({
          key: n.to.toString(), // to is not expanded in the insert
          value: JSON.stringify(n),
        })),
      });

      logger.info(
        `Produced notification events topic=${this.topic} count=${metadata.length}`,
        {
          ids: notifications.map((n) => n._id),
          partitions: metadata.map((m) => m.partition),
          topic: this.topic,
          count: metadata.length,
        }
      );
    } else {
      logger.info(
        "Stored notification events, but skipping publish... count=" +
          notifications.length,
        {
          count: notifications.length,
        }
      );
    }

    return notifications;
  }

  async notifyTest(to: string, user: ObjectId): Promise<NotificationDoc> {
    const notifications = await this.notify([
      {
        event: NotificationEventType.TEST,
        to,
        data: { user },
      },
    ]);
    return notifications[0];
  }

  async notifyApplicationCreated(
    to: string[],
    application: ObjectId,
    project: ObjectId,
    user: ObjectId
  ): Promise<NotificationDoc[]> {
    return await this.notify(
      to.map((to) => ({
        to,
        event: NotificationEventType.APPLICATION_CREATED,
        data: {
          application,
          project,
          user,
        },
      }))
    );
  }
}

export default NotificationService;
