/* eslint-disable @typescript-eslint/no-unused-vars */
import { Model } from 'mongoose';
import { User } from '../../interfaces/user';
import { Token } from '../../interfaces/token';

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      APP_URL: string;
      MONGODB_URI: string;
      MAILER_HOST: string;
      MAILER_PORT: string;
      MAILER_USER: string;
      MAILER_PASS: string;
    }
  }

  namespace Models {
    export type UserModel = Model<User>;
    export type TokenModel = Model<Token>;
  }
}
