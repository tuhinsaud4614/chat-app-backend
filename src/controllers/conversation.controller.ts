import { RequestHandler } from "express";
import { HttpError, HttpSuccess } from "../models";
import ConversationModel from "../models/conversation.model";
import ParticipantModel from "../models/participant.model";
import UserModel from "../models/user.model";
import {
  countConversations,
  findConversationById,
  findConversations,
} from "../services/conversation.service";
import {
  countMessagesWithConversation,
  findMessagesWithConversation,
} from "../services/message.service";
import {
  AllConversationReqQuery,
  CreateGroupReqBody,
  GroupUserRole,
  SingleConversationQuery,
  SingleConversationReqParams,
  USER_POPULATE_SELECT,
} from "../utility";

export const allConversations: RequestHandler<
  {},
  {},
  {},
  AllConversationReqQuery
> = async (req, res, next) => {
  // @ts-ignore
  const { id: userId } = req.user as IOmitUser;

  const limit = +req.query.limit!;
  const page = +req.query.page!;

  try {
    const tempCountConversations = await countConversations(userId!);

    if (tempCountConversations[0] && "id" in tempCountConversations[0]) {
      if (tempCountConversations[0].id < 1) {
        return next(new HttpError("No conversation found", 404));
      }

      const totalConversations = tempCountConversations[0].id;

      const conversations = await findConversations(userId, page, limit);

      const result = new HttpSuccess("All the conversations", {
        conversations,
        totalConversations: totalConversations,
        hasNext: limit * page! < totalConversations,
        nextPage: page + 1,
        previousPage: page - 1,
        totalPages: Math.ceil(totalConversations / limit),
      }).toObj();
      res.status(200).json(result);
      return;
    }

    return next(new HttpError("Failed to get the conversations", 400));
  } catch (error) {
    return next(new HttpError("Failed to get all conversations", 400));
  }
};

export const singleConversation: RequestHandler<
  SingleConversationReqParams,
  {},
  {},
  SingleConversationQuery
> = async (req, res, next) => {
  // @ts-ignore
  const { id: userId } = req.user as IOmitUser;

  const { conversationId } = req.params;

  try {
    const limit = +req.query.limit!;
    const page = +req.query.page!;
    const isExist = await findConversationById(conversationId!);

    if (!isExist) {
      return next(new HttpError("Conversation not exist", 404));
    }

    const countMessages = await countMessagesWithConversation(conversationId!);
    if (!countMessages) {
      return next(new HttpError("No conversation found", 404));
    }

    const messages = await findMessagesWithConversation(
      conversationId!,
      limit,
      page
    );

    const result = new HttpSuccess("All the messages", {
      messages,
      totalMessages: countMessages,
      hasNext: limit * page! < countMessages,
      nextPage: page + 1,
      previousPage: page - 1,
      totalPages: Math.ceil(countMessages / limit),
    }).toObj();
    res.status(200).json(result);
  } catch (error) {
    return next(new HttpError("Failed to get all messages", 400));
  }
};

export const createGroup: RequestHandler<{}, {}, CreateGroupReqBody> = async (
  req,
  res,
  next
) => {
  // @ts-ignore
  const { id: userId } = req.user as IOmitUser;

  const { members, name } = req.body;

  try {
    // const sess = await mongoose.startSession();

    const adminParticipant = new ParticipantModel({
      role: GroupUserRole.admin,
      user: userId,
    });

    const conversation = new ConversationModel({
      name: name,
      isGroup: true,
      participants: [adminParticipant],
    });

    for (let index = 0; index < members!.length; index++) {
      if (userId === members![index]) {
        continue;
      }
      const participant = new ParticipantModel({
        role: GroupUserRole.member,
        user: members![index],
      });

      conversation.participants.push(participant);
      await participant
        .save
        // { session: sess }
        ();
    }

    await adminParticipant.save();
    await conversation
      .save
      // { session: sess }
      ();
    // await sess.commitTransaction();
    // await sess.endSession();

    const popConversation = await conversation.populate({
      path: "participants",
      select: "_id role user",
      model: ParticipantModel,
      populate: {
        path: "user",
        select: USER_POPULATE_SELECT,
        model: UserModel,
      },
    });

    const result = new HttpSuccess("Group created", {
      popConversation,
    }).toObj();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return next(new HttpError("Failed to create group", 400));
  }
};
