import { Document } from 'mongoose';

export interface User extends Document {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  role: string;
  passwordHash: string;
  avatar: string;
  isVerified: boolean;
}

export interface UserForRegisterDTO {
  fullName: string;
  email: string;
  username: string;
  password1: string;
  password2: string;
}

export interface UserForLoginDTO {
  username: string;
  password: string;
}

export interface UserForListDTO {
  _id: string;
  fullName: string;
  username: string;
  avatar: string;
}

export interface UserForDetailDTO {
  _id: string;
  fullName: string;
  username: string;
  avatar: string;
}

export interface AccountForUpdateDTO {
  newEmail: string;
  newFullName: string;
  newUsername: string;
}
