import mongoose, { Document, Model, Types } from "mongoose";
import validation from "validator";
import { IUser } from "./user";

export interface IRecord extends Document {
  email: string;

  user: Types.ObjectId | IUser;
}

interface IRecordModel extends Model<IRecord> {}

const RecordSchema = new mongoose.Schema<IRecord, IRecordModel>(
  {
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      validate: [validation.isEmail, "invalid email"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const RecordModel = mongoose.model<IRecord, IRecordModel>(
  "Record",
  RecordSchema
);

export default RecordModel;
