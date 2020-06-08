import mongoose, { Schema } from 'mongoose';
import { Token } from '../interfaces/token';

const Token = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    verificationToken: {
      type: String,
      require: true,
      unique: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<Token>('Token', Token);
