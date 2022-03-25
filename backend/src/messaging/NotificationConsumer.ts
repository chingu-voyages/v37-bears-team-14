import { Consumer, EachMessagePayload } from "kafkajs";
import EventEmitter from "events";
import logger from "../logger";
import { INotification } from "../models/Notification";
import { Model } from "mongoose";

interface NotificationEventValue {
  id: string;
  to: string;
}

/**
 * Usage:
 *   const notificationConsumer = new NotificationConsumer(consumer, Notification);
 *   ...
 *   (req, res) => {
 *     notificationConsumer.addListener(req.query.to, (notification) => {
 *       res.write(JSON.stringify(notification.toJSON()))
 *     });
 *   }
 */
class NotificationConsumer extends EventEmitter {
  constructor(
    private consumer: Consumer,
    private notificationModel: Model<INotification>,
    private topic: string
  ) {
    super();
    this.run();
  }

  async run() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: this.topic,
    });
    await this.consumer.run({
      eachMessage: async (payload) => {
        await this.eachMessageHandler(payload);
      },
    });
  }

  async eachMessageHandler({ topic, message }: EachMessagePayload) {
    if (!message.value) {
      logger.error("message value missing! topic=" + topic);
      return;
    }

    try {
      const data: NotificationEventValue = JSON.parse(message.value.toString());
      logger.info("Consumed " + JSON.stringify(data));
      const id = data.id;
      const to = data.to;
      const notification = await this.notificationModel
        .findOne({ _id: id })
        .populate("data.project")
        .populate("data.user")
        .populate("data.application");

      this.emit(to, notification);
    } catch (err: any) {
      logger.error(
        "Failed to process message key=" + message.key + " " + err.message,
        {
          errorCode: err.code,
          errorMessage: err.message,
        }
      );
    }
  }
}

export default NotificationConsumer;
