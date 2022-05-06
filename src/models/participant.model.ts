import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import { GroupUserRole } from "../utility";
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
export class Participant {
  @prop({
    type: String,
    enum: GroupUserRole,
    default: "member",
  })
  public role: GroupUserRole;

  @prop({ ref: () => User, required: true })
  public user: Ref<User>;
}

const ParticipantModel = getModelForClass(Participant);
export default ParticipantModel;
