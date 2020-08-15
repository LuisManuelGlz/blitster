// eslint-disable-next-line object-curly-newline
import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import middlewares from '../middlewares/index';
import ProfileService from '../../services/profile.service';

const route = Router();

export default (app: Router): void => {
  app.use('/profile', route);

  /**
   * GET profile
   * @description Get current profile
   * @response 200 - OK
   */

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

  /**
   * GET profile/{userId}
   * @description Get a profile
   * @pathParam {string} userId - ID of user
   * @response 200 - OK
   */

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
