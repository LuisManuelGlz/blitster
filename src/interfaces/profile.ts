import { Document, Types } from 'mongoose';

export interface Profile extends Document {
  _id: Types.ObjectId;
  avatar: string;
  bio: string;
  user: string;
}

export interface ProfileForListDTO {
  _id: Types.ObjectId;
  avatar: string;
  bio: string;
  user: string;
}

export interface ProfileForDetailDTO {
  _id: Types.ObjectId;
  avatar: string;
  bio: string;
  user: string;
}
