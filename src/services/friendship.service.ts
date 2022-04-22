import { mongoose } from "@typegoose/typegoose";
import FriendshipModel from "../models/friendship.model";
import { CONVERSATION_PROJECT_SELECT, USER_PROJECT_SELECT } from "../utility";

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

export const getActiveFriends = async (
  userId: string,
  limit: number,
  page: number
) => {
  return FriendshipModel.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "sender",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "receiver",
        foreignField: "_id",
        as: "receiver",
      },
    },
    {
      $lookup: {
        from: "conversations",
        localField: "conversation",
        foreignField: "_id",
        as: "conversation",
      },
    },
    { $unwind: { path: "$sender" } },
    { $unwind: { path: "$receiver" } },
    {
      $match: {
        $or: [
          {
            "sender._id": new mongoose.Types.ObjectId(userId),
            "receiver.active": true,
          },
          {
            "receiver._id": new mongoose.Types.ObjectId(userId),
            "sender.active": true,
          },
        ],
      },
    },
    {
      $project: {
        ...USER_PROJECT_SELECT("sender"),
        ...USER_PROJECT_SELECT("receiver"),
        ...CONVERSATION_PROJECT_SELECT("conversation"),
      },
    },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);
};
