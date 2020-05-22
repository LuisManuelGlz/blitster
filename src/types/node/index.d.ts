/* eslint-disable @typescript-eslint/no-unused-vars */
import { Model } from 'mongoose';
import { User } from '../../interfaces/user';

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      MONGODB_URI: string;
    }
  }

  namespace Models {
    export type UserModel = Model<User>;
  }
}
