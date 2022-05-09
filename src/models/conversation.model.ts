import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import { GroupUserRole, IExtendedImage } from "../utility";
import { User } from "./user.model";

export class Participant {
  @prop({
    type: String,
    enum: GroupUserRole,
    default: "member",
  })
  public role: GroupUserRole;

  @prop({ ref: () => User, required: true })
  public user: Ref<User>;

  @prop({ default: () => new Date() })
  public joinedAt: Date;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    // this allow mixed type value insertion in the property
    allowMixed: Severity.ALLOW,
  },
})
export class Conversation {
  @prop({ type: () => Participant, required: true, default: [] })
  public participants: Participant[];

  @prop({ default: null })
  public name: string | null;

  @prop({ default: false })
  public isGroup: boolean;

  @prop({ default: null })
  public avatar: IExtendedImage;

  @prop({ default: () => new Date() })
  public lastModify: Date;
}

const ConversationModel = getModelForClass(Conversation);
export default ConversationModel;
