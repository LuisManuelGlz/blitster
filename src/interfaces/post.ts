import { Document } from 'mongoose';
import { User } from './user';
import { Comment } from './comment';

export interface Post extends Document {
  _id: string;
  user: User;
  content: string;
  images: string[];
  likes: User[];
  comments: Comment[];
  createdAt: Date;
}

export interface PostForListDTO {
  _id: string;
  user: User;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  liked: boolean;
  createdAt: Date;
}

export interface PostForCreateDTO {
  user: User;
  content: string;
  images: string[];
}

export interface LikesOfPostDTO {
  likes: User[];
}
