import { Document, Types } from 'mongoose';
import { Comment } from './comment';
import { User } from './user';

export interface Post extends Document {
  _id: string;
  user: Types.ObjectId;
  content: string;
  images: string[];
  likes: User[];
  comments: Comment[];
  createdAt: Date;
}

export interface PostForListDTO {
  _id: string;
  user: Types.ObjectId;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  liked: boolean;
  createdAt: Date;
}

export interface PostForCreateDTO {
  user: string;
  content: string;
  images: string[];
}

export interface LikesOfPostDTO {
  likes: User[];
}
