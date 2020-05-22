import { Application } from 'express';
import expressLoader from './express.loader';

export default ({ expressApp }: { expressApp: Application }): void => {
  expressLoader({ app: expressApp });
  console.log('Express loaded');
};
