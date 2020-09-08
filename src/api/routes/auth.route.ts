// eslint-disable-next-line object-curly-newline
import { Router, Request, Response, NextFunction } from 'express';
import { param, body, validationResult } from 'express-validator';
import { Container } from 'typedi';
import AuthService from '../../services/auth.service';

const route = Router();

export default (app: Router): void => {
  app.use('/auth', route);

  /**
   * @swagger
   * tags:
   *   name: Auth
   *   description: Auth management
   */

  /**
   * @swagger
   *
   * /api/auth/check-username:
   *   post:
   *     tags: [Auth]
   *     summary: Check if username already exists
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *             properties:
   *               username:
   *                 type: string
   *                 description: Username to check.
   *     responses:
   *       204:
   *         description: No content.
   */

  route.post(
    '/check-username',
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
    ],
    (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      return res.status(204).end();
    },
  );

  /**
   * @swagger
   *
   * /api/auth/check-email:
   *   post:
   *     tags: [Auth]
   *     summary: Check if email already exists
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Email to check.
   *     responses:
   *       204:
   *         description: No content.
   */

  route.post(
    '/check-email',
    [
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

      return res.status(204).end();
    },
  );

  /**
   * @swagger
   *
   * /api/auth/signup:
   *   post:
   *     tags: [Auth]
   *     summary: Register an user
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserForRegisterDTO'
   *     responses:
   *       201:
   *         description: User created successfully.
   */

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

      const authServiceInstance = Container.get(AuthService);

      try {
        const response = await authServiceInstance.signUp(req.body);

        return res.status(201).json(response);
      } catch (error) {
        return next(error);
      }
    },
  );

  /**
   * @swagger
   *
   * /api/auth/login:
   *   post:
   *     tags: [Auth]
   *     summary: Log in an user
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserForLoginDTO'
   *     responses:
   *       200:
   *         description: User logged in successfully.
   */

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

      const authServiceInstance = Container.get(AuthService);

      try {
        const response = await authServiceInstance.login(req.body);
        return res.status(200).json(response);
      } catch (error) {
        return next(error);
      }
    },
  );

  /**
   * @swagger
   *
   * /api/auth/refresh:
   *   post:
   *     tags: [Auth]
   *     summary: Refresh a token
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - userId
   *               - refreshToken
   *             properties:
   *               userId:
   *                 type: string
   *                 description: Id of user.
   *               refreshToken:
   *                 type: string
   *                 description: Expired token.
   *     responses:
   *       200:
   *         description: Token refreshed successfully.
   */

  route.post(
    '/refresh',
    [
      body('userId', 'User id is required').trim().notEmpty(),
      body('refreshToken', 'Refresh token is required').trim().notEmpty(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authServiceInstance = Container.get(AuthService);

      try {
        const response = await authServiceInstance.refresh(req.body);

        return res.status(200).json(response);
      } catch (error) {
        return next(error);
      }
    },
  );

  /**
   * @swagger
   *
   * /api/auth/revoke:
   *   post:
   *     tags: [Auth]
   *     summary: Revoke a token
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - refreshToken
   *             properties:
   *               refreshToken:
   *                 type: string
   *                 description: Refresh token to revoke.
   *     responses:
   *       204:
   *         description: No content.
   */

  route.post(
    '/revoke',
    body('refreshToken', 'Refresh token is required').trim().notEmpty(),
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authServiceInstance = Container.get(AuthService);

      try {
        await authServiceInstance.revoke(req.body.refreshToken);
        return res.status(204).end();
      } catch (error) {
        return next(error);
      }
    },
  );

  /**
   * @swagger
   *
   * /api/auth/verify-email/{verificationToken}:
   *   get:
   *     tags: [Auth]
   *     summary: Verify an user email
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: verificationToken
   *         schema:
   *           type: string
   *         required: true
   *         description: Verification token for verify user email
   *     responses:
   *       200:
   *         description: User email verified successfully.
   */

  route.get(
    '/verify-email/:verificationToken',
    param('verificationToken', 'Verification token is required').notEmpty(),
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authServiceInstance = Container.get(AuthService);

      try {
        await authServiceInstance.verifyEmail(req.params.verificationToken);
        return res
          .status(200)
          .json({ message: 'Great! Your email has been verified' });
      } catch (error) {
        return next(error);
      }
    },
  );
};
