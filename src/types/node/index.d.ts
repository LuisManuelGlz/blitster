/* eslint-disable @typescript-eslint/no-unused-vars */
import { Model } from 'mongoose';
import { User } from '../../interfaces/user';
import { Token } from '../../interfaces/token';
import { RefreshToken } from '../../interfaces/refreshToken';
import { Post } from '../../interfaces/post';
import { Comment } from '../../interfaces/comment';

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      TOKEN_TYPE: string;
      SECRET_KEY: string;
      ACCESS_TOKEN_LIFETIME: string;
      PORT: string;
      APP_URL: string;
      MONGODB_URI: string;
      MAILER_HOST: string;
      MAILER_PORT: string;
      MAILER_USER: string;
      MAILER_PASS: string;
    }
  }

  namespace Express {
    export interface Request {
      userId: string;
      userEmail: string;
    }
  }

  namespace Models {
    export type UserModel = Model<User>;
    export type TokenModel = Model<Token>;
    export type RefreshTokenModel = Model<RefreshToken>;
    export type PostModel = Model<Post>;
    export type CommentModel = Model<Comment>;
  }
}
