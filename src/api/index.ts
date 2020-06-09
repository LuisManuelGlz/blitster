import { Router } from 'express';
import auth from './routes/auth.route';
import posts from './routes/post.route';
import comment from './routes/comment.route';

export default (): Router => {
  const app = Router();

  auth(app);
  posts(app);
  comment(app);

  return app;
};
