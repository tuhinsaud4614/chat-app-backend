import express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
import { connect } from "mongoose";
import path from "path";
import logger from "./logger";
import { HttpError } from "./models";
import routes from "./routes";
import { redisClient } from "./utility";
require("dotenv").config({
  path: path.join(
    process.cwd(),
    process.env.NODE_ENV === "development" ? "dev.env" : ".env"
  ),
});

const app = express();

app.use(express.static(path.join(process.cwd(), "images")));
app.use(json());
app.use(urlencoded({ extended: false }));

app.use("/api/v1", routes);

// No route found
app.use((_: Request, __: Response, next: NextFunction) => {
  const error = new HttpError("Could not found this route.", 404);
  next(error);
});

app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    logger.warn("Header already sent");
    return next(err);
  }

  if (err instanceof HttpError) {
    logger.error(err.message);
    res.status(err.code).json(err.toObj());
    return;
  }

  logger.error(err.message);
  const result = new HttpError(
    "Something went wrong.",
    500,
    "An unknown error occurs."
  ).toObj();
  res.status(500).json(result);
});

app.listen(process.env.PORT || 4000, async () => {
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
