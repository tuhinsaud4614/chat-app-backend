import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { Conversation } from "./conversation.model";
import { User } from "./user.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Friendship {
  @prop({ required: true, ref: () => User })
  public sender: Ref<User>;

  @prop({ required: true, ref: () => User })
  public receiver: Ref<User>;

  @prop({ ref: () => Conversation, default: null })
  public conversation: Ref<Conversation> | null;

  @prop({ default: false })
  public accept: boolean;
}

const FriendshipModel = getModelForClass(Friendship);
export default FriendshipModel;
