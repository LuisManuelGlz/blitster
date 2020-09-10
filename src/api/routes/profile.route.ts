// eslint-disable-next-line object-curly-newline
import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import middlewares from '../middlewares/index';
import ProfileService from '../../services/profile.service';

const route = Router();

export default (app: Router): void => {
  app.use('/profile', route);

  /**
   * @swagger
   * tags:
   *   name: Profile
   *   description: Profile management
   */

  /**
   * @swagger
   *
   * /api/profile:
   *   get:
   *     tags: [Profile]
   *     summary: Get current profile
   *     produces:
   *       - application/json
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Ok
   *       401:
   *         description: Unauthorized
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
   * @swagger
   *
   * /api/profile/{userId}:
   *   get:
   *     tags: [Profile]
   *     summary: Get a profile
   *     produces:
   *       - application/json
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of user
   *     responses:
   *       200:
   *         description: Ok
   *       401:
   *         description: Unauthorized
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
