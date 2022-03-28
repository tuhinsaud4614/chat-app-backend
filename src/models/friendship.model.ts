import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from "@typegoose/typegoose";
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

  @prop({ default: false })
  public accept: boolean;
}

const FriendshipModel = getModelForClass(Friendship);
export default FriendshipModel;
