import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
  Severity,
} from "@typegoose/typegoose";
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
export class Conversation {
  @prop({ ref: () => User, required: true, default: [] })
  public participants: Ref<User>[];

  @prop({ default: null })
  public name: string | null;

  @prop({ default: false })
  public isGroup: boolean;
}

const ConversationModel = getModelForClass(Conversation);
export default ConversationModel;
