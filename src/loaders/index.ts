import { Application } from 'express';
import mongooseLoader from './mongoose.loader';
import dependencyInjectorLoader from './dependencyInjector.loader';
import expressLoader from './express.loader';

export default async ({
  expressApp,
}: {
  expressApp: Application;
}): Promise<void> => {
  await mongooseLoader();
  console.log('Database loaded and connected... 😎');

  dependencyInjectorLoader();
  console.log('Dependency Injector loaded');

  expressLoader({ app: expressApp });
  console.log('Express loaded');
};
