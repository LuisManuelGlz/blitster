// eslint-disable-next-line object-curly-newline
import { Router, Request, Response, NextFunction } from 'express';
import { param, body, validationResult } from 'express-validator';
import { Container } from 'typedi';
import AuthService from '../../services/auth.service';
import { TokenOutput } from '../../interfaces/refreshToken';

const route = Router();

export default (app: Router): void => {
  app.use('/auth', route);

  route.post(
    '/check-email',
    [
      body('fullName', 'Please write your name').trim().notEmpty(),
      body('email', "Please write your email, I won't spam you, I promise")
        .normalizeEmail()
        .trim()
        .isEmail()
        .withMessage('Please write a valid email address')
        .custom(async (value) => {
          const user = await Container.get<Models.UserModel>(
            'userModel',
          ).findOne({ email: value });
          return user ? Promise.reject() : Promise.resolve();
        })
        .withMessage('Email already exists')
        .notEmpty(),
    ],
    (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      return res.status(200).end();
    },
  );

  route.post(
    '/signup',
    [
      body('fullName', 'Please write your name').trim().notEmpty(),
      body('email', "Please write your email, I won't spam you, I promise")
        .normalizeEmail()
        .trim()
        .isEmail()
        .withMessage('Please write a valid email address')
        .custom(async (value) => {
          const user = await Container.get<Models.UserModel>(
            'userModel',
          ).findOne({ email: value });
          return user ? Promise.reject() : Promise.resolve();
        })
        .withMessage('Email already exists')
        .notEmpty(),
      body('username', 'Please write a username')
        .trim()
        .custom(async (value) => {
          const user = await Container.get<Models.UserModel>(
            'userModel',
          ).findOne({ username: value });
          return user ? Promise.reject() : Promise.resolve();
        })
        .withMessage('Username already exists')
        .notEmpty(),
      body('password1', "Don't forget your password")
        .isLength({ min: 8 })
        .withMessage('Please enter a password with 8 or more characters')
        .notEmpty(),
      body('password2', 'Please confirm your password')
        .custom((value, { req }) => value === req.body.password1)
        .withMessage('Passwords must match')
        .notEmpty(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authServiceInstance: AuthService = Container.get(AuthService);

      try {
        const response: TokenOutput = await authServiceInstance.signUp(
          req.body,
        );

        return res.status(201).json(response);
      } catch (error) {
        return next(error);
      }
    },
  );

  route.post(
    '/login',
    [
      body('username', 'Please write a username').trim().notEmpty(),
      body('password', "Don't forget your password").notEmpty(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authServiceInstance: AuthService = Container.get(AuthService);

      try {
        const response: TokenOutput = await authServiceInstance.login(req.body);
        return res.status(200).json(response);
      } catch (error) {
        return next(error);
      }
    },
  );

  route.post(
    '/refresh',
    [
      body('userId', 'User id is requiered').trim().notEmpty(),
      body('refreshToken', 'Refresh token is required').trim().notEmpty(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authServiceInstance: AuthService = Container.get(AuthService);

      try {
        const response: TokenOutput = await authServiceInstance.refresh(
          req.body,
        );

        return res.status(200).json(response);
      } catch (error) {
        return next(error);
      }
    },
  );

  route.post(
    '/revoke',
    body('refreshToken', 'Refresh token is required').trim().notEmpty(),
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authServiceInstance: AuthService = Container.get(AuthService);

      try {
        await authServiceInstance.revoke(req.body.refreshToken);
        return res.status(204).end();
      } catch (error) {
        return next(error);
      }
    },
  );

  route.get(
    '/verify-email/:verificationToken',
    param('verificationToken', 'Verification token is required').notEmpty(),
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authServiceInstance: AuthService = Container.get(AuthService);

      try {
        await authServiceInstance.vefiryEmail(req.params.verificationToken);
        return res
          .status(200)
          .json({ message: 'Great! Your email has been verified' });
      } catch (error) {
        return next(error);
      }
    },
  );
};
