import { RequestHandler } from "express";
import { HttpError, HttpSuccess } from "../models";
import MessageModel from "../models/message.model";
import {
  findConversationById,
  findConversations,
} from "../services/conversation.service";
import {
  countMessagesWithConversation,
  findMessagesWithConversation,
} from "../services/message.service";
import {
  SendMessageReqBody,
  SendMessageReqParams,
  SingleConversationQuery,
  SingleConversationReqParams,
} from "../utility";

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

export const singleConversation: RequestHandler<
  SingleConversationReqParams,
  {},
  {},
  SingleConversationQuery
> = async (req, res, next) => {
  // @ts-ignore
  const { id: userId } = req.user as IOmitUser;

  const { conversationId } = req.params;

  try {
    const limit = +req.query.limit!;
    const page = +req.query.page!;
    const isExist = await findConversationById(conversationId!);

    if (!isExist) {
      return next(new HttpError("Conversation not exist", 404));
    }

    const countMessages = await countMessagesWithConversation(conversationId!);
    if (!countMessages) {
      return next(new HttpError("No conversation found", 404));
    }

    const messages = await findMessagesWithConversation(
      conversationId!,
      limit,
      page
    );

    const result = new HttpSuccess("All the messages", {
      messages,
      totalMessages: countMessages,
      hasNext: limit * page! < countMessages,
      nextPage: page + 1,
      previousPage: page - 1,
      totalPages: Math.ceil(countMessages / limit),
    }).toObj();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return next(new HttpError("Failed to get all messages", 400));
  }
};

export const sendMessage: RequestHandler<
  SendMessageReqParams,
  {},
  SendMessageReqBody
> = async (req, res, next) => {
  // @ts-ignore
  const { id: userId } = req.user as IOmitUser;

  const { conversationId } = req.params;
  const { text } = req.body;

  try {
    const isExist = await findConversationById(conversationId!);

    if (!isExist) {
      return next(new HttpError("Conversation not exist", 404));
    }

    const newMessage = new MessageModel({
      text: text,
      conversation: conversationId,
      sender: userId,
    });

    await newMessage.save();
    const result = new HttpSuccess("New message sent", newMessage).toObj();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return next(new HttpError("Failed to send message", 400));
  }
};
