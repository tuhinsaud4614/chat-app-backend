import { RequestHandler } from "express";
import { HttpError, HttpSuccess } from "../models";
import {
  createFriendship,
  findFriendshipById,
  isExistFriendship,
} from "../services/friendship.service";
import { findUserById } from "../services/user.service";
import {
  AcceptRequestReqParams,
  IOmitUser,
  SendRequestReqParams,
} from "../utility";

export const sendFriendRequest: RequestHandler<SendRequestReqParams> = async (
  req,
  res,
  next
) => {
  const { receiverId } = req.params;
  // @ts-ignore
  const { id: senderId } = req.user as IOmitUser;

  try {
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
  const { friendshipId } = req.params;
  // @ts-ignore
  const { id: receiverId } = req.user as IOmitUser;

  try {
    const friendship = await findFriendshipById(friendshipId!);

    if (!friendship) {
      return next(new HttpError("This friendship not exist", 404));
    }

    if (!friendship.receiver || friendship.receiver.toString() !== receiverId) {
      return next(new HttpError("You can't accept this request", 400));
    }

    if (friendship.accept) {
      return next(new HttpError("They are already friend", 400));
    }

    friendship.accept = true;
    await friendship.save();

    res.status(200).json(
      new HttpSuccess("Accept friend request successfully", {
        friendshipId,
        isAccept: true,
      }).toObj()
    );
  } catch (error) {
    return next(new HttpError("Accept friend request failed", 400));
  }
};
