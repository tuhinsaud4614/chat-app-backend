import MessageModel from "../models/message.model";

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
    .lean()
    .select("-__v");
};
