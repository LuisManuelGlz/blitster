import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Container } from 'typedi';
import AuthService from '../../services/auth.service';

const route = Router();

export default (app: Router): void => {
  app.use('/auth', route);

  route.post(
    '/signup',
    [
      body('username', 'Please write a username')
        .custom(async (value) => {
          const user = await Container.get<Models.UserModel>(
            'userModel',
          ).findOne({ username: value });
          return user ? Promise.reject() : Promise.resolve();
        })
        .withMessage('Username already exists')
        .notEmpty(),
      body('email', "Please write your email, I won't spam you, I promise")
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
    async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authServiceInstance = Container.get(AuthService);

      const user = await authServiceInstance.SignUp(req.body);

      return res.status(201).json({ user });
    },
  );
};
