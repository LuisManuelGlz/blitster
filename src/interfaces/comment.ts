import { Document } from 'mongoose';
import { User } from './user';

export interface Comment extends Document {
  _id: string;
  user: User;
  content: string;
  likes: User[];
  comments: Comment[];
  createdAt: Date;
}

export interface CommentForDetailDTO {
  _id: string;
  user: User;
  content: string;
  likes: User[];
  comments: Comment[];
  createdAt: Date;
}

export interface CommentForCreateDTO {
  user: User;
  content: string;
}

export interface CommentPost {
  postId: string;
}

export interface CommentComment {
  commentId: string;
}
