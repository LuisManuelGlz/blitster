import { Document } from 'mongoose';
import { User } from './user';

export interface Token extends Document {
  user: User;
  token: string;
}

export interface TokenOutput {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AccessTokenOutput {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
}
