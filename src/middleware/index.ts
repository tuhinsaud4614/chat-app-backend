import { NextFunction, Request, Response } from "express";
import { AnySchema, ValidationError } from "yup";
import { HttpError } from "../models";

export const validateRequest = (schema: AnySchema, code: number = 500) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (er) {
      const { message } = er as ValidationError;
      return next(new HttpError(message, code));
    }
  };
};
