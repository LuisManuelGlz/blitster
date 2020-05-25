import mongoose, { Schema } from 'mongoose';
import { Token } from '../interfaces/token';

const Token = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    token: { type: String, require: true },
  },
  { timestamps: { createdAt: 'created_at' } },
);

export default mongoose.model<Token>('Token', Token);
