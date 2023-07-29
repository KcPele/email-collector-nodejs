// import * as dotenv from "dotenv";
import validation from "validator";
// dotenv.config();
import { Model, Schema, HydratedDocument, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;

  password: string;
}

export interface IUserCreated extends IUser {
  token: string;
}

interface UserModel extends Model<IUserCreated> {
  loginUser(
    email: string,
    password: string
  ): Promise<HydratedDocument<IUserCreated>> | { error: string };
}

const schema = new Schema<IUser, UserModel>(
  {
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      validate: [validation.isEmail, "invalid email"],
    },

    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = model<IUser, UserModel>("User", schema);
export default User;
