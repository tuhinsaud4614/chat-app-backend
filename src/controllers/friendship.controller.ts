import { mongoose } from "@typegoose/typegoose";
import { RequestHandler } from "express";
import { HttpError, HttpSuccess } from "../models";
import ConversationModel from "../models/conversation.model";
import ParticipantModel from "../models/participant.model";
import { findFriendConversation } from "../services/conversation.service";
import {
  createFriendship,
  findFriendshipById,
  getActiveFriends,
  isExistFriendship,
} from "../services/friendship.service";
import { findUserById } from "../services/user.service";
import {
  AcceptRequestReqParams,
  ActiveFriendsQuery,
  GroupUserRole,
  IOmitUser,
  SendRequestReqParams,
  UserRole,
} from "../utility";

export const sendFriendRequest: RequestHandler<SendRequestReqParams> = async (
  req,
  res,
  next
) => {
  try {
    const { receiverId } = req.params;
    // @ts-ignore
    const { id: senderId } = req.user as IOmitUser;
    const sender = await findUserById(senderId);
    const receiver = await findUserById(receiverId!);

    if (receiverId === senderId) {
      return next(
        new HttpError("Sender and receiver should be different", 400)
      );
    }

    if (!sender || !receiver) {
      return next(new HttpError("User not exist", 404));
    }

    if (sender.role === UserRole.admin || receiver.role === UserRole.admin) {
      return next(new HttpError("User should be general user.", 400));
    }

    const isExist = await isExistFriendship(senderId, receiverId!);

    if (isExist) {
      return next(new HttpError("Already they are friend", 400));
    }

    const newFriendship = await createFriendship(senderId, receiverId!);

    res.status(201).json(
      new HttpSuccess("Send friend request successfully", {
        friendshipId: newFriendship._id,
        isAccept: newFriendship.accept,
      }).toObj()
    );
  } catch (error) {
    return next(new HttpError("Send friend request failed", 400));
  }
};

export const acceptFriendRequest: RequestHandler<
  AcceptRequestReqParams
> = async (req, res, next) => {
  try {
    const { friendshipId } = req.params;
    // @ts-ignore
    const { id: receiverId } = req.user as IOmitUser;
    const friendship = await findFriendshipById(friendshipId!);

    if (!friendship) {
      return next(new HttpError("This friendship not exist", 404));
    }

    if (!friendship.receiver || friendship.receiver.toString() !== receiverId) {
      return next(new HttpError("You can't accept this request", 400));
    }

    if (!friendship.sender) {
      return next(new HttpError("You can't accept this request", 400));
    }

    if (friendship.accept) {
      return next(new HttpError("They are already friend", 400));
    }

    const senderId = friendship.sender.toString();

    const isExistConversation = await findFriendConversation(
      senderId,
      receiverId
    );

    friendship.accept = true;
    if (isExistConversation) {
      await friendship.save();
      return res.status(200).json(
        new HttpSuccess("Accept friend request successfully", {
          friendshipId,
          conversationId: isExistConversation._id,
        }).toObj()
      );
    }

    const senderParticipant = new ParticipantModel({
      role: GroupUserRole.member,
      user: senderId,
    });

    const receiverParticipant = new ParticipantModel({
      role: GroupUserRole.member,
      user: receiverId,
    });

    const conversation = new ConversationModel({
      participants: [senderParticipant, receiverParticipant],
    });
    friendship.conversation = conversation;

    const sess = await mongoose.startSession();
    try {
      await sess.withTransaction(async () => {
        // Have to solve this error
        // await friendship.save({ session: sess });
        // await conversation.save({ session: sess });
        await senderParticipant.save();
        await receiverParticipant.save();
        await friendship.save();
        await conversation.save();
      });
    } finally {
      console.log("hello");
      sess.endSession();
    }

    res.status(200).json(
      new HttpSuccess("Accept friend request successfully", {
        friendshipId,
        conversationId: conversation._id,
      }).toObj()
    );
  } catch (error) {
    console.log(error);

    return next(new HttpError("Accept friend request failed", 400));
  }
};

export const cancelFriendRequest: RequestHandler<
  AcceptRequestReqParams
> = async (req, res, next) => {
  try {
    const { friendshipId } = req.params;
    // @ts-ignore
    const { id: userId } = req.user as IOmitUser;
    const friendship = await findFriendshipById(friendshipId!);

    if (!friendship) {
      return next(new HttpError("This friendship not exist", 404));
    }

    const cancelErr = new HttpError("You can't cancel this request", 400);
    if (
      (friendship.receiver && friendship.receiver.toString() === userId) ||
      (friendship.sender && friendship.sender.toString() === userId)
    ) {
      if (friendship.accept) {
        return next(cancelErr);
      }

      await friendship.remove();
      res
        .status(200)
        .json(
          new HttpSuccess("Cancel friend request successfully", null).toObj()
        );
      return;
    }

    return next(cancelErr);
  } catch (error) {
    return next(new HttpError("Cancel friend request failed", 400));
  }
};

// Active friends
export const allActiveFriends: RequestHandler<
  {},
  {},
  {},
  ActiveFriendsQuery
> = async (req, res, next) => {
  // @ts-ignore
  const { id: userId } = req.user as IOmitUser;
  try {
    const limit = +req.query.limit!;
    const page = +req.query.page!;

    const friendships = await getActiveFriends(userId, limit, page);

    if (!friendships.length) {
      return next(new HttpError("No active friends found", 404));
    }

    const result = new HttpSuccess(
      "All the active friends",
      friendships
    ).toObj();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Failed to get all active friends", 400));
  }
};
