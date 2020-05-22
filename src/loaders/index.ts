import { Application } from 'express';
import expressLoader from './express.loader';
import mongooseLoader from './mongoose.loader';

export default async ({
  expressApp,
}: {
  expressApp: Application;
}): Promise<void> => {
  await mongooseLoader();
  console.log('Database loaded and connected... 😎');

  expressLoader({ app: expressApp });
  console.log('Express loaded');
};
