// eslint-disable-next-line object-curly-newline
import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import middlewares from '../middlewares/index';
import FollowService from '../../services/follow.service';

const route = Router();

export default (app: Router): void => {
  app.use('/follow', route);

  /**
   * POST follow/{userToFollowId}
   * @description Follow a profile
   * @pathParam {string} userToFollowId - ID of user to follow
   * @response 200 - OK
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
   * GET follow/get-followers/{userId}
   * @description Get all followers of a profile
   * @pathParam {string} userId - ID of user
   * @response 200 - OK
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
   * GET follow/get-following/{userId}
   * @description Get all following of a profile
   * @pathParam {string} userId - ID of user
   * @response 200 - OK
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
