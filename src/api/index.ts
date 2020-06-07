import { Router } from 'express';
import auth from './routes/auth.route';
import posts from './routes/post.route';

export default (): Router => {
  const app = Router();

  auth(app);
  posts(app);

  return app;
};
