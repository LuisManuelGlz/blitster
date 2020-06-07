import { Application } from 'express';
import mongooseLoader from './mongoose.loader';
import dependencyInjectorLoader from './dependencyInjector.loader';
import expressLoader from './express.loader';
import UserModel from '../models/user.model';
import TokenModel from '../models/token.model';
import RefreshTokenModel from '../models/refreshToken.model';
import PostModel from '../models/post.model';
import CommentModel from '../models/comment.model';

export default async ({
  expressApp,
}: {
  expressApp: Application;
}): Promise<void> => {
  await mongooseLoader();
  console.log('Database loaded and connected... 😎');

  const userModel = {
    name: 'userModel',
    model: UserModel,
  };
  const tokenModel = {
    name: 'tokenModel',
    model: TokenModel,
  };
  const refreshTokenModel = {
    name: 'refreshTokenModel',
    model: RefreshTokenModel,
  };
  const postModel = {
    name: 'postModel',
    model: PostModel,
  };
  const commentModel = {
    name: 'commentModel',
    model: CommentModel,
  };

  dependencyInjectorLoader({
    models: [userModel, tokenModel, refreshTokenModel, postModel, commentModel],
  });
  console.log('Dependency Injector loaded');

  expressLoader({ app: expressApp });
  console.log('Express loaded');
};
