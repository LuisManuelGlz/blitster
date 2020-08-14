// eslint-disable-next-line object-curly-newline
import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import middlewares from '../middlewares/index';
import ProfileService from '../../services/profile.service';

const route = Router();

export default (app: Router): void => {
  app.use('/profile', route);

  route.get(
    '/',
    middlewares.auth,
    async (req: Request, res: Response, next: NextFunction) => {
      const profileServiceInstance = Container.get(ProfileService);

      try {
        const response = await profileServiceInstance.getMyProfile(req.userId);
        return res.send(response);
      } catch (error) {
        return next(error);
      }
    },
  );

  route.get(
    '/:userId',
    middlewares.auth,
    async (req: Request, res: Response, next: NextFunction) => {
      const profileServiceInstance = Container.get(ProfileService);

      try {
        const response = await profileServiceInstance.getProfile(
          req.params.userId,
        );

        return res.send(response);
      } catch (error) {
        return next(error);
      }
    },
  );
};
