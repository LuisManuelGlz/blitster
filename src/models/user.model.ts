import mongoose, { Schema } from 'mongoose';
import { User } from '../interfaces/user';
import ROLES from '../constants/roles';

const User = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default:
        'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: ROLES.User,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model<User>('User', User);
