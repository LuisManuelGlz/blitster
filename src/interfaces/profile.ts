import { Document, Types } from 'mongoose';
import { User } from './user';

export interface Profile extends Document {
  _id: Types.ObjectId;
  bio: string;
  user: string;
  followers: User[];
  following: User[];
}

export interface ProfileForListDTO {
  _id: Types.ObjectId;
  bio: string;
  user: string;
  followers: number;
  following: number;
}

export interface ProfileForDetailDTO {
  _id: Types.ObjectId;
  bio: string;
  user: string;
  followers: User[];
  following: User[];
}
