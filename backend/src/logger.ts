import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "winston-transport-logtail";
import { mustGetConfig } from "./config";

const config = mustGetConfig(process.env);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [],
});

if (config.nodeEnv !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

if (config.logtailToken) {
  logger.add(new LogtailTransport(new Logtail(config.logtailToken), logger));
}

export default logger;
