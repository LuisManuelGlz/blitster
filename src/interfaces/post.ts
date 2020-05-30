import { Document } from 'mongoose';
import { User } from './user';

export interface Post extends Document {
  _id: string;
  user: User;
  content: string;
  images: string[];
  likes: User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PostForCreateDTO {
  user: User;
  content: string;
  images: string[];
}
