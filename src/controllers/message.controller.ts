import { RequestHandler } from "express";
import { omit, pick } from "lodash";
import { HttpError, HttpSuccess } from "../models";
import MessageModel from "../models/message.model";
import UserModel from "../models/user.model";
import { generateImages } from "../services/common.service";
import { findConversationById } from "../services/conversation.service";
import { findMessageById } from "../services/message.service";
import {
  getAttachmentExtAndDest,
  IAttachment,
  SeenByReqParams,
  SendAttachmentReqParams,
  SendImageReqParams,
  SendTextReqBody,
  SendTextReqParams,
  USER_POPULATE_SELECT,
} from "../utility";

export const sendText: RequestHandler<
  SendTextReqParams,
  {},
  SendTextReqBody
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

    // Last modification on the conversation
    isExist.lastModify = new Date();
    await isExist.save();

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

    // Last modification on the conversation
    isExist.lastModify = new Date();
    await isExist.save();

    const result = await newMessage.populate({
      path: "sender",
      select: USER_POPULATE_SELECT,
      model: UserModel,
    });

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

export const sendImage: RequestHandler<SendImageReqParams> = async (
  req,
  res,
  next
) => {
  // @ts-ignore
  const { id: userId } = req.user as IOmitUser;

  const { conversationId } = req.params;
  const file = req.file;

  try {
    const isExist = await findConversationById(conversationId!);

    if (!isExist) {
      return next(new HttpError("Conversation not exist", 404));
    }

    const images = await generateImages(file!);

    const newMessage = await MessageModel.create({
      conversation: conversationId,
      sender: userId,
      message: images,
    });

    const result = await newMessage.populate({
      path: "sender",
      select: USER_POPULATE_SELECT,
      model: UserModel,
    });

    // Last modification on the conversation
    isExist.lastModify = new Date();
    await isExist.save();

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

export const seenBy: RequestHandler<SeenByReqParams> = async (
  req,
  res,
  next
) => {
  // @ts-ignore
  const { id: userId } = req.user as IOmitUser;

  const { messageId } = req.params;

  try {
    const isExist = await findMessageById(messageId!);

    if (!isExist) {
      return next(new HttpError("This message not exist", 404));
    }

    if (isExist.seenBy.includes(userId)) {
      return next(new HttpError("Message already seen", 400));
    }

    isExist.seenBy.push(userId);
    await isExist.save();

    res
      .status(201)
      .json(
        new HttpSuccess(
          "Message seen",
          pick(isExist.toObject(), ["_id", "seenBy"])
        ).toObj()
      );
  } catch (error) {
    console.log(error);

    return next(new HttpError("Failed to seen message", 400));
  }
};
