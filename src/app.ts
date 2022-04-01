import compression from "compression";
import cors from "cors";
import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
import helmet from "helmet";
import { createServer } from "http";
import { connect } from "mongoose";
import path from "path";
import swagger from "swagger-ui-express";
import logger from "./logger";
import { errorHandler } from "./middleware";
import { HttpError } from "./models";
import routes from "./routes";
import swaggerDocument from "./swagger.json";
import { redisClient, SocketIO } from "./utility";
require("dotenv").config({
  path: path.join(
    process.cwd(),
    process.env.NODE_ENV === "development" ? "dev.env" : ".env"
  ),
});

const app = express();
const httpServer = createServer(app);
const socket = SocketIO.getInstance(httpServer);
socket.on("connection", (socket) => {
  logger.info("Socket connected successfully.");
  socket.on("disconnect", () => {
    logger.warn("Socket is disconnected.");
  });
});

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));

app.use("/images", express.static(path.join(process.cwd(), "images")));
app.use("/videos", express.static(path.join(process.cwd(), "videos")));
app.use("/audios", express.static(path.join(process.cwd(), "audios")));
app.use("/documents", express.static(path.join(process.cwd(), "documents")));
app.use("/api-docs", swagger.serve, swagger.setup(swaggerDocument));
app.use("/api/v1", routes);

// No route found
app.use((_: Request, __: Response, next: NextFunction) => {
  const error = new HttpError("Could not found this route", 404);
  next(error);
});

app.use(errorHandler);

httpServer.listen(process.env.PORT || 4000, async () => {
  logger.info(`App is running on ${process.env.PORT || 4000}.`);

  connect(process.env.MONGO_DB_URI || "mongodb://127.0.0.1:27017/chat-app")
    .then(() => {
      logger.info(`Database connected successfully.`);
    })
    .catch((er) => {
      logger.error(`Database connection failed and err is: ${er}.`);
    });

  try {
    await redisClient.connect();
  } catch (error) {
    logger.error(`Redis connection failed. ${error}`);
  }
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  httpServer.close();
});
