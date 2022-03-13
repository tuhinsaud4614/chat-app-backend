import UserModel, { User } from "../models/user.model";

export const createUserService = async (input: Partial<User>) => {
  return await UserModel.create(input);
};
