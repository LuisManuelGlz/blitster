// eslint-disable-next-line object-curly-newline
import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import Container from 'typedi';
import middlewares from '../middlewares/index';
import UserService from '../../services/user.service';

const route = Router();

export default (app: Router): void => {
  app.use('/users', route);

  /**
   * GET users
   * @description Get all users
   * @response 200 - OK
   */

  route.get(
    '/',
    middlewares.auth,
    async (req: Request, res: Response, next: NextFunction) => {
      const userServiceInstance = Container.get(UserService);

      try {
        const response = await userServiceInstance.getUsers();
        return res.status(200).json(response);
      } catch (error) {
        return next(error);
      }
    },
  );

  /**
   * GET users/{userId}
   * @description Get a user
   * @pathParam {string} userId - ID of user
   * @response 200 - OK
   */

  route.get(
    '/:userId',
    middlewares.auth,
    async (req: Request, res: Response, next: NextFunction) => {
      const userServiceInstance = Container.get(UserService);

      try {
        const response = await userServiceInstance.getUser(req.params.userId);

        return res.send(response);
      } catch (error) {
        return next(error);
      }
    },
  );

  /**
   * PUT users
   * @description Update user info
   * @response 201 - User info updated
   */

  route.put(
    '/',
    middlewares.auth,
    [
      body('newFullName', 'Please write your name').trim().notEmpty(),
      body('newEmail', "Please write your email, I won't spam you, I promise")
        .normalizeEmail()
        .trim()
        .isEmail()
        .withMessage('Please write a valid email address')
        .notEmpty(),
      body('newUsername', 'Please write a username').trim().notEmpty(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userServiceInstance = Container.get(UserService);

      try {
        await userServiceInstance.updateAccount(
          req.userId,
          req.userUsername,
          req.userEmail,
          req.body,
        );

        return res
          .status(201)
          .json({ message: 'Your account has been updated successfully!' });
      } catch (error) {
        return next(error);
      }
    },
  );
};
