// eslint-disable-next-line object-curly-newline
import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import middlewares from '../middlewares/index';
import FollowService from '../../services/follow.service';

const route = Router();

export default (app: Router): void => {
  app.use('/follow', route);

  /**
   * @swagger
   * tags:
   *   name: Follow
   *   description: Follow management
   */

  /**
   * @swagger
   *
   * /api/follow/{userToFollowId}:
   *   post:
   *     tags: [Follow]
   *     summary: Follow a user
   *     produces:
   *       - application/json
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userToFollowId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of user to follow
   *     responses:
   *       200:
   *         description: Ok
   *       401:
   *         description: Unauthorized
   */

  route.post(
    '/:userToFollowId',
    middlewares.auth,
    async (req: Request, res: Response, next: NextFunction) => {
      const followServiceInstance = Container.get(FollowService);

      try {
        const response = await followServiceInstance.follow(
          req.userId,
          req.params.userToFollowId,
        );
        return res.json(response);
      } catch (error) {
        return next(error);
      }
    },
  );

  /**
   * @swagger
   *
   * /api/follow/get-followers/{userId}:
   *   get:
   *     tags: [Follow]
   *     summary: Get all followers of a user
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
    '/get-followers/:userId',
    middlewares.auth,
    async (req: Request, res: Response, next: NextFunction) => {
      const followServiceInstance = Container.get(FollowService);

      try {
        const response = await followServiceInstance.getFollowers(
          req.params.userId,
        );

        return res.json(response);
      } catch (error) {
        return next(error);
      }
    },
  );

  /**
   * @swagger
   *
   * /api/follow/get-following/{userId}:
   *   get:
   *     tags: [Follow]
   *     summary: Get all following of a user
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
    '/get-following/:userId',
    middlewares.auth,
    async (req: Request, res: Response, next: NextFunction) => {
      const followServiceInstance = Container.get(FollowService);

      try {
        const response = await followServiceInstance.getFollowing(
          req.params.userId,
        );

        return res.json(response);
      } catch (error) {
        return next(error);
      }
    },
  );
};
