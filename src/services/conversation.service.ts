import ConversationModel from "../models/conversation.model";
import UserModel from "../models/user.model";
import { USER_POPULATE_SELECT } from "../utility";

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

export const findConversations = async (userId: string) => {
  return await ConversationModel.find({
    participants: {
      $in: [userId],
    },
  })
    .lean()
    .populate("participants", USER_POPULATE_SELECT, UserModel);
};
