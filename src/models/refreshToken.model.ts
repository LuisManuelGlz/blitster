import mongoose, { Schema } from 'mongoose';
import { RefreshToken } from '../interfaces/refreshToken';

const RefreshToken = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    refreshToken: {
      type: String,
      require: true,
      unique: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<RefreshToken>('RefreshToken', RefreshToken);
