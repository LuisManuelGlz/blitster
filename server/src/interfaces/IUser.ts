import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  avatar: string,
  passwordSalt: string;
  passwordHash: string;
  creationDate: Date;
}

export interface IUserForRegisterDTO {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

export interface IUserForLoginDTO {
  username: string;
  password: string;
}
