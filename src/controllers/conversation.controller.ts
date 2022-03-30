import { RequestHandler } from "express";
import { HttpError, HttpSuccess } from "../models";
import { findConversations } from "../services/conversation.service";

export const allConversations: RequestHandler = async (req, res, next) => {
  // @ts-ignore
  const { id: userId } = req.user as IOmitUser;

  try {
    const conversations = await findConversations(userId);
    if (!conversations.length) {
      return next(new HttpError("No conversation found", 404));
    }

    const result = new HttpSuccess(
      "All the conversations",
      conversations
    ).toObj();
    res.status(200).json(result);
  } catch (error) {
    return next(new HttpError("Failed to get all conversations", 400));
  }
};
