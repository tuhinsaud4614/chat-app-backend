import ConversationModel from "../models/conversation.model";

export const createConversation = async (
  senderId: string,
  receiverId: string,
  name?: string
) => {
  if (name) {
    return await ConversationModel.create({
      participants: [senderId, receiverId],
      isGroup: true,
      name: name,
    });
  }

  return await ConversationModel.create({
    participants: [senderId, receiverId],
  });
};

export const findFriendConversation = async (
  senderId: string,
  receiverId: string
) => {
  return await ConversationModel.findOne({
    $and: [
      { participants: { $size: 2 } },
      { participants: { $all: [senderId, receiverId] } },
    ],
  });
};