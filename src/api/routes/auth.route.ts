// eslint-disable-next-line object-curly-newline
import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { Container } from 'typedi';
import AuthService from '../../services/auth.service';
import { TokenOutput } from '../../interfaces/token';

const route = Router();

export default (app: Router): void => {
  app.use('/auth', route);

  route.post(
    '/signup',
    [
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
      body('password1', "Don't forget your password")
        .isLength({ min: 8 })
        .withMessage('Please enter a password with 8 or more characters')
        .notEmpty(),
      body('password2', 'Please confirm your password')
        .custom((value, { req }) => value === req.body.password1)
        .withMessage('Passwords must match')
        .notEmpty(),
    ],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authServiceInstance: AuthService = Container.get(AuthService);

      const response: TokenOutput = await authServiceInstance.signUp(req.body);

      return res.status(201).json(response);
    },
  );
};
