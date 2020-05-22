import { Router } from 'express';
import auth from './routes/auth.route';

export default (): Router => {
  const app = Router();

  auth(app);

  return app;
};
