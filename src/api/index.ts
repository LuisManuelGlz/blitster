import { Router } from 'express';
import auth from './routes/auth.route';
import posts from './routes/post.route';
import comment from './routes/comment.route';
import user from './routes/user.route';
import profile from './routes/profile.route';

export default (): Router => {
  const app = Router();

  auth(app);
  posts(app);
  comment(app);
  user(app);
  profile(app);

  return app;
};
