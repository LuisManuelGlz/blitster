import mongoose, { Schema } from 'mongoose';
import { Profile } from '../interfaces/profile';

const Profile = new Schema(
  {
    avatar: {
      type: String,
      default:
        'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    },
    bio: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export default mongoose.model<Profile>('Profile', Profile);
