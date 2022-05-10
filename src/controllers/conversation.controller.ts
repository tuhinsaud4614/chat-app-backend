import { RequestHandler } from "express";
import mongoose from "mongoose";
import { HttpError, HttpSuccess } from "../models";
import ConversationModel, { Participant } from "../models/conversation.model";
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
  AddMemberToGroupReqBody,
  AddMemberToGroupReqParams,
  AllConversationReqQuery,
  ChangeGroupNameReqBody,
  ChangeGroupNameReqParams,
  CreateGroupReqBody,
  GroupUserRole,
  PromoteMemberFromGroupReqBody,
  PromoteMemberFromGroupReqParams,
  removeAllSpacesFromText,
  RemoveMemberToGroupReqBody,
  RemoveMemberToGroupReqParams,
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
    const totalConversations = await countConversations(userId!);
    console.log(countConversations);

    if (totalConversations < 1) {
      return next(new HttpError("No conversation found", 404));
    }

    const conversations = await findConversations(userId, page, limit, true);

    const result = new HttpSuccess("All the conversations", {
      conversations,
      totalConversations: totalConversations,
      hasNext: limit * page! < totalConversations,
      nextPage: page + 1,
      previousPage: page - 1,
      totalPages: Math.ceil(totalConversations / limit),
    }).toObj();
    return res.status(200).json(result);
  } catch (error) {
    return next(new HttpError("Failed to get the conversations", 400));
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
      return next(new HttpError("No message found for this conversation", 404));
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
    const conversation = new ConversationModel({
      name: name,
      isGroup: true,
      participants: [{ role: GroupUserRole.admin, user: userId }],
    });

    members!.forEach((member) => {
      if (userId === member) {
        return;
      }

      conversation.participants.push({
        role: GroupUserRole.member,
        user: new mongoose.Types.ObjectId(member),
      } as Participant);
    });

    await conversation.save();
    await conversation.populate("participants.user", USER_POPULATE_SELECT);

    const result = new HttpSuccess("Group created", conversation).toObj();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return next(new HttpError("Failed to create group", 400));
  }
};

export const addMembersToGroup: RequestHandler<
  AddMemberToGroupReqParams,
  {},
  AddMemberToGroupReqBody
> = async (req, res, next) => {
  // @ts-ignore
  const { id: userId } = req.user as IOmitUser;

  const { members } = req.body;
  const { conversationId } = req.params;

  try {
    const conversation = await findConversationById(conversationId!);

    if (!conversation || !conversation.isGroup) {
      return next(new HttpError("Conversation not exist", 404));
    }

    const isUserIndex = conversation.participants.findIndex(
      (p) => p.user?.toString() === userId
    );

    // check is the current user exists in the conversation or the current user is only member
    if (
      isUserIndex === -1 ||
      conversation.participants[isUserIndex].role === GroupUserRole.member
    ) {
      return next(new HttpError("You can't add member", 404));
    }

    members!.forEach((member) => {
      // check is the current user already in the conversation or the member already in the conversation
      if (
        userId === member ||
        conversation.participants.some((p) => p.user?.toString() === member)
      ) {
        return;
      }

      conversation.participants.push({
        role: GroupUserRole.member,
        user: new mongoose.Types.ObjectId(member),
      } as Participant);
    });

    await conversation.save();
    await conversation.populate("participants.user", USER_POPULATE_SELECT);

    const result = new HttpSuccess("Members added", conversation).toObj();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Failed to add members to group", 400));
  }
};

export const removeMemberToGroup: RequestHandler<
  RemoveMemberToGroupReqParams,
  {},
  RemoveMemberToGroupReqBody
> = async (req, res, next) => {
  // @ts-ignore
  const { id: userId } = req.user as IOmitUser;

  const { member } = req.body;
  const { conversationId } = req.params;

  try {
    const conversation = await findConversationById(conversationId!);

    if (!conversation || !conversation.isGroup) {
      return next(new HttpError("Conversation not exist", 404));
    }

    const isUser = conversation.participants.find(
      (p) => p.user?.toString() === userId
    );

    // check is the current user exists in the conversation or the current user is only member
    if (!isUser) {
      return next(new HttpError("User not exist", 404));
    }

    const currentMember = conversation.participants.find(
      (p) => p.user?.toString() === member
    );

    if (!currentMember) {
      return next(new HttpError("This member not exist", 404));
    }

    if (
      // admin can remove member and moderator
      (isUser.role === GroupUserRole.admin &&
        (currentMember.role === GroupUserRole.moderator ||
          currentMember.role === GroupUserRole.member)) ||
      // moderator can remove itself and member
      (isUser.role === GroupUserRole.moderator &&
        currentMember.role === GroupUserRole.member) ||
      // member or moderator can remove theme
      (isUser.role !== GroupUserRole.admin && userId === member)
    ) {
      const restParticipants = conversation.participants.filter(
        (p) => p.user?.toString() !== member
      );

      conversation.participants = restParticipants;
      await conversation.save();
      await conversation.populate({
        path: "participants.user",
        select: USER_POPULATE_SELECT,
        model: UserModel,
      });

      const result = new HttpSuccess("Remove member", {
        ...conversation.toObject(),
      }).toObj();
      res.status(200).json(result);
    } else {
      return next(new HttpError("You can't remove member", 404));
    }
  } catch (error) {
    console.log(error);
    return next(new HttpError("Failed to remove member to group", 400));
  }
};

export const promoteMemberToGroup: RequestHandler<
  PromoteMemberFromGroupReqParams,
  {},
  PromoteMemberFromGroupReqBody
> = async (req, res, next) => {
  // @ts-ignore
  const { id: userId } = req.user as IOmitUser;

  const { member, role } = req.body;
  const { conversationId } = req.params;

  try {
    const conversation = await findConversationById(conversationId!);

    if (!conversation || !conversation.isGroup) {
      return next(new HttpError("Conversation not exist", 404));
    }

    const isUser = conversation.participants.find(
      (p) => p.user?.toString() === userId
    );
    const currentMember = conversation.participants.find(
      (p) => p.user?.toString() === member
    );

    // check is the current user exists in the conversation or the current user is only member
    if (!isUser || !currentMember) {
      return next(new HttpError("This member not exist", 404));
    }

    if (isUser.role !== GroupUserRole.admin) {
      return next(new HttpError("You can't promote anyone", 400));
    }

    if (currentMember.role === (role! as GroupUserRole)) {
      return next(new HttpError("The member already promoted", 400));
    }

    if (role === GroupUserRole.admin) {
      // For reference type it will effect on the object
      currentMember.role = GroupUserRole.admin;
      isUser.role = GroupUserRole.moderator;
    } else {
      currentMember.role = role! as GroupUserRole;
    }

    await conversation.save();

    const result = new HttpSuccess(
      "Promote member",
      { conversationId, member, role },
      "You demoted as moderator and member promoted as admin"
    ).toObj();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Failed to promote member to group", 400));
  }
};

export const changeGroupName: RequestHandler<
  ChangeGroupNameReqParams,
  {},
  ChangeGroupNameReqBody
> = async (req, res, next) => {
  // @ts-ignore
  const { id: userId } = req.user as IOmitUser;
  const { conversationId } = req.params;
  const name = removeAllSpacesFromText(req.body.name!);

  try {
    const conversation = await findConversationById(conversationId!);

    if (!conversation || !conversation.isGroup || !name) {
      return next(new HttpError("Conversation not exist", 404));
    }

    const isUser = conversation.participants.find(
      (p) => p.user?.toString() === userId
    );

    // check is the current user exists in the conversation or the current user is only member
    if (!isUser || isUser.role === GroupUserRole.member) {
      return next(new HttpError("You can't change the group name", 404));
    }

    conversation.name = name;
    await conversation.save();

    const result = new HttpSuccess("Group name updated", {
      conversationId: conversationId,
      name: name,
    }).toObj();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Failed to update group name", 400));
  }
};
