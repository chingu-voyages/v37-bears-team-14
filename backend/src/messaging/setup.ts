import { Kafka } from "kafkajs";
import { mustGetConfig } from "../config";
import logger from "../logger";
import Notification from "../models/Notification";
import NotificationService from "./NotificationService";
import NotificationConsumer from "./NotificationConsumer";

const config = mustGetConfig(process.env);

export const TOPIC_QUEUE_NOTIFICATION = "queue.notification_events";

// These singleton classes store references to a single instance
// of these objects for the entire application.
// The getter functions return a reference to this single instance.
let kafkaSingleton: Kafka | null = null;
let notificationConsumerSingleton: NotificationConsumer | null = null;
let notificationServiceSingleton: NotificationService;

if (config.kafkaEnabled) {
  // Kafka producer/consumer setup.
  // Reference: https://github.com/tulios/kafkajs
  kafkaSingleton = new Kafka({
    brokers: config.kafkaBrokers!,
    sasl: {
      mechanism: "scram-sha-256",
      username: config.kafkaUsername!,
      password: config.kafkaPassword!,
    },
    ssl: true,
  });

  const consumer = kafkaSingleton.consumer({ groupId: "web-notifications" });
  notificationConsumerSingleton = new NotificationConsumer(
    consumer,
    Notification,
    TOPIC_QUEUE_NOTIFICATION
  );

  const producer = kafkaSingleton.producer();
  producer.connect();
  notificationServiceSingleton = new NotificationService(
    Notification,
    producer,
    TOPIC_QUEUE_NOTIFICATION
  );

  logger.info("Notification messaging enabled");
} else {
  notificationServiceSingleton = new NotificationService(Notification);
}

export const getNotificationConsumer = (): NotificationConsumer | null => {
  return notificationConsumerSingleton;
};

export const getNotificationService = (): NotificationService => {
  return notificationServiceSingleton;
};
