import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import { IExtendedImage } from "../utility";
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

  @prop({ default: null })
  public text: string | null;

  @prop({ default: [] })
  public images: mongoose.Types.Array<IExtendedImage>;
}

const MessageModel = getModelForClass(Message);
export default MessageModel;
