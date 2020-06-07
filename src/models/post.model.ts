import mongoose, { Schema } from 'mongoose';
import { Post } from '../interfaces/post';

const Post = new Schema(
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
    images: [
      {
        type: String,
      },
    ],
    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: { createdAt: 'created_at' } },
);

export default mongoose.model<Post>('Post', Post);
