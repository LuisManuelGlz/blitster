import { Application } from 'express';
import mongooseLoader from './mongoose.loader';
import dependencyInjectorLoader from './dependencyInjector.loader';
import expressLoader from './express.loader';
import UserModel from '../models/user.model';
import TokenModel from '../models/token.model';

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

  dependencyInjectorLoader({ models: [userModel, tokenModel] });
  console.log('Dependency Injector loaded');

  expressLoader({ app: expressApp });
  console.log('Express loaded');
};
