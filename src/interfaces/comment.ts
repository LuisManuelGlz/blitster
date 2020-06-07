import { Document } from 'mongoose';
import { User } from './user';

export interface Comment extends Document {
  _id: string;
  user: User;
  content: string;
  likes: User[];
  createdAt: Date;
  updatedAt: Date;
}