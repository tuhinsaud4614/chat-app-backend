import { createLogger, format, transports } from "winston";

const { combine, timestamp, errors, json } = format;

const logger = () =>
  createLogger({
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: { service: "user-service" },
    transports: [new transports.Console()],
  });

export default logger;
