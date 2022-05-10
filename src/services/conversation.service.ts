import mongoose from "mongoose";
import ConversationModel from "../models/conversation.model";
import UserModel from "../models/user.model";
import { USER_POPULATE_SELECT } from "../utility";

export const findFriendConversation = async (
  senderId: string,
  receiverId: string
) => {
  return ConversationModel.findOne({
    $and: [
      { participants: { $size: 2 } },
      {
        "participants.user": {
          $all: [
            new mongoose.Types.ObjectId(senderId),
            new mongoose.Types.ObjectId(receiverId),
          ],
        },
      },
    ],
  });
  // return ConversationModel.findOne({
  //   $and: [
  //     { participants: { $size: 2 } },
  //     { participants: { $all: [senderId, receiverId] } },
  //     { isGroup: false },
  //   ],
  // });
};

export const countConversations = async (userId: string) => {
  return ConversationModel.find({
    "participants.user": {
      $in: [new mongoose.Types.ObjectId(userId)],
    },
  }).count();
  // return ConversationModel.aggregate([
  //   {
  //     $lookup: {
  //       from: "participants",
  //       let: { participants: "$participants" },
  //       pipeline: [{ $match: { $expr: { $in: ["$_id", "$$participants"] } } }],
  //       as: "participants",
  //     },
  //   },
  //   {
  //     $match: {
  //       "participants.user": {
  //         $in: [new Types.ObjectId(userId)],
  //       },
  //     },
  //   },
  //   { $count: "id" },
  // ]);
};

export const findConversations = async (
  userId: string,
  page: number,
  limit: number,
  populate: boolean = false
) => {
  if (populate) {
    return ConversationModel.find({
      "participants.user": {
        $in: [new mongoose.Types.ObjectId(userId)],
      },
    })
      .sort([["lastModify", -1]])
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("participants.user", USER_POPULATE_SELECT, UserModel);
  }

  return ConversationModel.find({
    "participants.user": {
      $in: [new mongoose.Types.ObjectId(userId)],
    },
  })
    .skip((page - 1) * limit)
    .limit(limit);
  // return ConversationModel.aggregate([
  //   {
  //     $lookup: {
  //       from: "participants",
  //       let: { participants: "$participants" },
  //       pipeline: [
  //         { $match: { $expr: { $in: ["$_id", "$$participants"] } } },
  //         {
  //           $lookup: {
  //             from: "users",
  //             localField: "user",
  //             foreignField: "_id",
  //             as: "user",
  //           },
  //         },
  //         { $unwind: { path: "$user" } },
  //         {
  //           $project: {
  //             _id: 0,
  //             role: 1,
  //             ...USER_PROJECT_SELECT("user"),
  //           },
  //         },
  //       ],
  //       as: "participants",
  //     },
  //   },
  //   {
  //     $match: {
  //       "participants.user._id": {
  //         $in: [new Types.ObjectId(userId)],
  //       },
  //     },
  //   },
  //   { $skip: (page - 1) * limit },
  //   { $limit: limit },
  // ]);
};

export const findConversationById = async (id: string) => {
  return ConversationModel.findById(id).exec();
};
