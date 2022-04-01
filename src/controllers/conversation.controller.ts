import { RequestHandler } from "express";
import { omit } from "lodash";
import { HttpError, HttpSuccess } from "../models";
import MessageModel from "../models/message.model";
import UserModel from "../models/user.model";
import {
  findConversationById,
  findConversations,
} from "../services/conversation.service";
import {
  countMessagesWithConversation,
  findMessagesWithConversation,
} from "../services/message.service";
import {
  getAttachmentExtAndDest,
  IAttachment,
  SendAttachmentReqParams,
  SendMessageReqBody,
  SendMessageReqParams,
  SingleConversationQuery,
  SingleConversationReqParams,
  USER_POPULATE_SELECT,
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
    return next(new HttpError("Failed to get all messages", 400));
  }
};

export const sendText: RequestHandler<
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

    const newMessage = await MessageModel.create({
      message: text,
      conversation: conversationId,
      sender: userId,
    });

    const message = await newMessage.populate({
      path: "sender",
      select: USER_POPULATE_SELECT,
      model: UserModel,
    });
    const result = new HttpSuccess(
      "New message sent",
      omit(message.toObject(), "__v")
    ).toObj();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return next(new HttpError("Failed to send message", 400));
  }
};

export const sendAttachment: RequestHandler<SendAttachmentReqParams> = async (
  req,
  res,
  next
) => {
  // @ts-ignore
  const { id: userId } = req.user as IOmitUser;

  const { conversationId } = req.params;

  try {
    const isExist = await findConversationById(conversationId!);

    if (!isExist) {
      return next(new HttpError("Conversation not exist", 404));
    }

    const { baseDest, attachmentType } = getAttachmentExtAndDest(
      req.file!.mimetype
    );

    const newMessage = await MessageModel.create({
      conversation: conversationId,
      sender: userId,
      message: {
        type: attachmentType,
        value: `${baseDest}/${req.file!.filename}`,
      } as IAttachment,
    });

    const result = await newMessage.populate({
      path: "sender",
      select: USER_POPULATE_SELECT,
      model: UserModel,
    });

    if (!isExist) {
      return next(new HttpError("Conversation not exist", 404));
    }

    res
      .status(201)
      .json(
        new HttpSuccess(
          "New message sent",
          omit(result.toObject(), "__v")
        ).toObj()
      );
  } catch (error) {
    console.log(error);

    return next(new HttpError("Failed to send message", 400));
  }
};
