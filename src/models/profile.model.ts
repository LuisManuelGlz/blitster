import mongoose, { Schema } from 'mongoose';
import { Profile } from '../interfaces/profile';

const Profile = new Schema(
  {
    bio: {
      type: String,
      default: 'Hi there!',
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<Profile>('Profile', Profile);
