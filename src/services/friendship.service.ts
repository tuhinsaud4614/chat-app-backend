import FriendshipModel from "../models/friendship.model";

export const createFriendship = async (
  senderId: string,
  receiverId: string
) => {
  return await FriendshipModel.create({
    sender: senderId,
    receiver: receiverId,
  });
};

export const isExistFriendship = async (
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

export const findFriendshipById = async (id: string) => {
  return await FriendshipModel.findById(id);
};
