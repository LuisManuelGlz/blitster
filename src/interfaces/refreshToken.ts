import { Document } from 'mongoose';
import { User } from './user';

export interface RefreshToken extends Document {
  user: User;
  refreshToken: string;
}
