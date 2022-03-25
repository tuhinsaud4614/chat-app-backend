import {
  DocumentType,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
  Severity,
} from "@typegoose/typegoose";
import { compare, hash } from "bcryptjs";
import logger from "../logger";
import { IExtendedImage, UserRole } from "../utility";

// class Image {
//   @prop({ required: true })
//   originalName: string;

//   @prop({ required: true })
//   webpName: string;

//   @prop({ required: true })
//   originalUrl: string;

//   @prop({ required: true })
//   webpUrl: string;

//   @prop({ required: true })
//   width: number;

//   @prop({ required: true })
//   height: number;
// }

// class Avatar {
//   @prop({ ref: () => Image })
//   public main: Ref<Image>;

//   @prop({ ref: () => Image })
//   public 640: Ref<Image>;

//   @prop({ ref: () => Image })
//   public 750: Ref<Image>;
//   @prop({ ref: () => Image })
//   public 828: Ref<Image>;

//   @prop({ ref: () => Image })
//   public 1080: Ref<Image>;

//   @prop({ ref: () => Image })
//   public 1200: Ref<Image>;

//   @prop({ ref: () => Image })
//   public 1920: Ref<Image>;

//   @prop({ ref: () => Image })
//   public 2048: Ref<Image>;

//   @prop({ ref: () => Image })
//   public 3840: Ref<Image>;
// }

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
@index({ email: 1 })
export class User {
  @prop({ default: null })
  public firstName: string | null;

  @prop({ default: null })
  public lastName: string | null;

  @prop({ required: true, unique: true })
  public email: string;

  @prop({ required: true })
  public password: string;

  @prop({ default: null })
  public avatar: null | IExtendedImage;

  @prop({ required: true, type: String, enum: UserRole })
  public role: UserRole;

  @prop({ default: false })
  public verified: boolean;

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
