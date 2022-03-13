import {
  DocumentType,
  getModelForClass,
  modelOptions,
  pre,
  prop,
  Severity,
} from "@typegoose/typegoose";
import { compare, hash } from "bcryptjs";
import { nanoid } from "nanoid";
import logger from "../logger";

@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const hashPassword = await hash(this.password, 12);
  this.password = hashPassword;
  return;
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    // this allow mixed type value insertion in the property
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ default: null })
  public firstName!: string | null;

  @prop({ default: null })
  public lastName!: string | null;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop()
  public avatar?: string;

  @prop({ required: true, default: () => nanoid() })
  public verificationCode!: string;

  @prop()
  public passwordResetCode?: string | null;

  @prop({ default: false })
  public active?: boolean;

  async validatePassword(this: DocumentType<User>, newPassword: string) {
    try {
      return await compare(newPassword, this.password);
    } catch (error) {
      logger.error(`Could not validate password ${error}`);
      return false;
    }
  }
}

const UserModel = getModelForClass(User);
export default UserModel;
