import { Model } from 'mongoose';
import IUser from '../../interfaces/IUser';

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PORT: string
    }
  }
  
  namespace Models {
    export type UserModel = Model<IUser>;
  }
}