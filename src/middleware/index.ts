import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { AnySchema, ValidationError } from "yup";
import logger from "../logger";
import { HttpError } from "../models";

export const validateRequest = (schema: AnySchema, code: number = 500) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
        file: req.file,
        files: req.files,
      });
      return next();
    } catch (er) {
      const { message } = er as ValidationError;
      return next(new HttpError(message, code));
    }
  };
};

export const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
  if (res.headersSent) {
    logger.warn("Header already sent");
    return next(err);
  }

  // if (req.file) {
  //   unlink(req.file.path, (linkErr) => {
  //     if (linkErr) {
  //       return next(new HttpError("File remove failed", 500, err.code));
  //     }
  //   });
  // }

  if (err instanceof MulterError) {
    logger.error(err.message);
    const newError = new HttpError(err.message, 400, err.code);

    res.status(400).json(newError.toObj());
    return;
  }

  if (err instanceof HttpError) {
    logger.error(err.message);
    res.status(err.code).json(err.toObj());
    return;
  }

  logger.error(err.message);
  const result = new HttpError(
    "Something went wrong",
    500,
    "An unknown error occurs"
  ).toObj();
  res.status(500).json(result);
};
