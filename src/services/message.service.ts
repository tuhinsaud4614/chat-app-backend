import MessageModel from "../models/message.model";
import UserModel from "../models/user.model";
import { USER_POPULATE_SELECT } from "../utility";

export const countMessagesWithConversation = async (conversationId: string) => {
  return await MessageModel.find({
    conversation: conversationId,
  }).count();
};

export const findMessagesWithConversation = async (
  conversationId: string,
  limit: number,
  page: number
) => {
  return await MessageModel.find({
    conversation: conversationId,
  })
    .sort([["updatedAt", -1]])
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("sender", USER_POPULATE_SELECT, UserModel)
    .lean()
    .select("-__v");
};

export const findMessageById = async (id: string) => {
  return MessageModel.findById(id);
};
