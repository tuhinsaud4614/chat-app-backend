import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import { IAttachment, IExtendedImage } from "../utility";
import { Conversation } from "./conversation.model";
import { User } from "./user.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    // this allow mixed type value insertion in the property
    allowMixed: Severity.ALLOW,
  },
})
export class Message {
  @prop({ ref: () => Conversation, required: true })
  public conversation: Ref<Conversation>;

  @prop({ ref: () => User, required: true })
  public sender: Ref<User>;

  @prop({ required: true })
  public message: string | IAttachment | IExtendedImage;

  @prop({ ref: () => User, required: true, default: [] })
  public seenBy: Ref<User>[];
}

const MessageModel = getModelForClass(Message);
export default MessageModel;
