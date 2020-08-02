// eslint-disable-next-line object-curly-newline
import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import middlewares from '../middlewares/index';
import { UserForDetailDTO, UserForListDTO } from '../../interfaces/user';
import UserService from '../../services/user.service';

const route = Router();

export default (app: Router): void => {
  app.use('/users', route);

  route.get(
    '/me',
    middlewares.auth,
    async (req: Request, res: Response, next: NextFunction) => {
      const userServiceInstance: UserService = Container.get(UserService);

      try {
        const response: UserForDetailDTO = await userServiceInstance.getProfile(
          req.userId,
        );

        return res.send(response);
      } catch (error) {
        return next(error);
      }
    },
  );

  route.get(
    '/',
    middlewares.auth,
    async (req: Request, res: Response, next: NextFunction) => {
      const userServiceInstance: UserService = Container.get(UserService);

      try {
        const response: UserForListDTO[] = await userServiceInstance.getUsers();
        return res.status(200).json(response);
      } catch (error) {
        return next(error);
      }
    },
  );

  route.get(
    '/:userId',
    middlewares.auth,
    async (req: Request, res: Response, next: NextFunction) => {
      const userServiceInstance: UserService = Container.get(UserService);

      try {
        const response: UserForDetailDTO = await userServiceInstance.getUser(
          req.params.userId,
        );

        return res.send(response);
      } catch (error) {
        return next(error);
      }
    },
  );
};
