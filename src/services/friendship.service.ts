import FriendshipModel from "../models/friendship.model";

export const createFriendshipService = async (
  senderId: string,
  receiverId: string
) => {
  return await FriendshipModel.create({
    sender: senderId,
    receiver: receiverId,
  });
};

export const isExistFriendshipService = async (
  senderId: string,
  receiverId: string
) => {
  return await FriendshipModel.findOne({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId },
    ],
  });
};
