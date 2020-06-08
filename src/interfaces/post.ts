import { Document } from 'mongoose';
import { User } from './user';
import { Comment } from './comment';

export interface Post extends Document {
  _id: string;
  user: User;
  content: string;
  images: string[];
  likes: { user: string }[];
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
  createdAt: Date;
}

export interface PostForDetailDTO {
  _id: string;
  user: User;
  content: string;
  images: string[];
  likes: { user: string }[];
  comments: Comment[];
  createdAt: Date;
}

export interface PostForCreateDTO {
  user: User;
  content: string;
  images: string[];
}
