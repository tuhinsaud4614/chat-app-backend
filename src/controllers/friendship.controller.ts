import { RequestHandler } from "express";
import { HttpError, HttpSuccess } from "../models";
import {
  createFriendshipService,
  isExistFriendshipService,
} from "../services/friendship.service";
import { findUserById } from "../services/user.service";
import { IOmitUser, SendRequestReqParams } from "../utility";

export const sendFriendRequest: RequestHandler<SendRequestReqParams> = async (
  req,
  res,
  next
) => {
  const { receiverId } = req.params;
  // @ts-ignore
  const { id: senderId } = req.user as IOmitUser;
  console.log(receiverId, senderId);

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

    const isExist = await isExistFriendshipService(senderId, receiverId!);

    if (isExist) {
      return next(new HttpError("Already they are friend", 400));
    }

    const newFriendship = await createFriendshipService(senderId, receiverId!);

    res.status(201).json(
      new HttpSuccess("Sent friend request successfully", {
        friendshipId: newFriendship._id,
        isAccept: newFriendship.accept,
      }).toObj()
    );
  } catch (error) {
    console.log(error);

    return next(new HttpError("Send friend request failed", 400));
  }
};
