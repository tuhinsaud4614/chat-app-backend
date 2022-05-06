import { Types } from "mongoose";
import ConversationModel from "../models/conversation.model";
import { USER_PROJECT_SELECT } from "../utility";

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

export const countConversations = async (userId: string) => {
  return ConversationModel.aggregate([
    {
      $lookup: {
        from: "participants",
        let: { participants: "$participants" },
        pipeline: [{ $match: { $expr: { $in: ["$_id", "$$participants"] } } }],
        as: "participants",
      },
    },
    {
      $match: {
        "participants.user": {
          $in: [new Types.ObjectId(userId)],
        },
      },
    },
    { $count: "id" },
  ]);
};

export const findConversations = async (
  userId: string,
  page: number,
  limit: number
) => {
  return ConversationModel.aggregate([
    {
      $lookup: {
        from: "participants",
        let: { participants: "$participants" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$participants"] } } },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: { path: "$user" } },
          {
            $project: {
              _id: 0,
              role: 1,
              ...USER_PROJECT_SELECT("user"),
            },
          },
        ],
        as: "participants",
      },
    },
    {
      $match: {
        "participants.user._id": {
          $in: [new Types.ObjectId(userId)],
        },
      },
    },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);
};

export const findConversationById = async (id: string) => {
  return ConversationModel.findById(id);
};
