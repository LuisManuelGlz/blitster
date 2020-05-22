import { Document } from 'mongoose';

export interface User extends Document {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  passwordSalt: string;
  passwordHash: string;
  creationDate: Date;
}

export interface UserForRegisterDTO {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

export interface UserForLoginDTO {
  username: string;
  password: string;
}
