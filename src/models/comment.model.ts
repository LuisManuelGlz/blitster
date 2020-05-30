import mongoose, { Schema } from 'mongoose';
import { Comment } from '../interfaces/comment';

const Comment = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },
    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<Comment>('Comment', Comment);
