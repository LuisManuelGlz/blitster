import { Router } from 'express';
import auth from './routes/auth.route'

export default () => {
  const app = Router();

  auth(app);

  return app;
}