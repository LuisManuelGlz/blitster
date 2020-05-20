import { IUser } from "../interfaces/IUser";
import mongoose, { Schema } from "mongoose";

const User = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    emil: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    passwordSalt: {
      type: String,
      required: true,
    },
    creationDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", User);
