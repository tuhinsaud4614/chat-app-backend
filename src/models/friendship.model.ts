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
