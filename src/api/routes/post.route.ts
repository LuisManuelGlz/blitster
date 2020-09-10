// eslint-disable-next-line object-curly-newline
import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import path from 'path';
import multer from 'multer';
import randtoken from 'rand-token';
import { body, validationResult } from 'express-validator';
import PostService from '../../services/post.service';
import middlewares from '../middlewares/index';
import { BadRequestError } from '../../helpers/errors';

const storage = multer.diskStorage({
  destination: 'uploads',
  filename(req, file, cb) {
    cb(
      null,
      `${randtoken.uid(8)}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new BadRequestError("That's not an image"));
    }
  },
});

const route = Router();

export default (app: Router): void => {
  app.use('/posts', route);

  /**
   * @swagger
   *
   * /api/posts:
   *   get:
   *     tags: [Post]
   *     summary: Get all posts
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
      const postServiceInstance = Container.get(PostService);

      try {
        const response = await postServiceInstance.getPosts(req.userId);
        return res.status(200).json(response);
      } catch (error) {
        return next(error);
      }
    },
  );

  /**
   * @swagger
   *
   * /api/posts:
   *   post:
   *     tags: [Post]
   *     summary: Create a post
   *     produces:
   *       - application/json
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/PostForCreateDTO'
   *     responses:
   *       201:
   *         description: Post created successfully
   *       401:
   *         description: Unauthorized
   */

  route.post(
    '/',
    middlewares.auth,
    upload.array('images', 12),
    body('content', "Ooops! Don't forget to write something...").notEmpty(),
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const postServiceInstance = Container.get(PostService);

      const images = JSON.parse(JSON.stringify(req.files)).map(
        (file: Express.Multer.File) => `/uploads/${file.filename}`,
      );
      const postForCreateDTO = {
        user: req.userId,
        images,
        ...req.body,
      };

      try {
        await postServiceInstance.createPost(postForCreateDTO);
        return res.status(201).json('Post created!');
      } catch (error) {
        return next(error);
      }
    },
  );

  /**
   * @swagger
   *
   * /api/posts/{postId}:
   *   delete:
   *     tags: [Post]
   *     summary: Delete a post
   *     produces:
   *       - application/json
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: postId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of post
   *     responses:
   *       204:
   *         description: Post deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Post not found
   */

  route.delete(
    '/:postId',
    middlewares.auth,
    async (req: Request, res: Response, next: NextFunction) => {
      const postServiceInstance = Container.get(PostService);

      try {
        await postServiceInstance.deletePost(req.params.postId);
        return res.status(204).end();
      } catch (error) {
        return next(error);
      }
    },
  );

  /**
   * @swagger
   *
   * /api/posts/like/{postId}:
   *   post:
   *     tags: [Post]
   *     summary: Returns the post liked
   *     produces:
   *       - application/json
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: postId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of post
   *     responses:
   *       200:
   *         description: Ok
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Post not found
   */

  route.post(
    '/like/:postId',
    middlewares.auth,
    async (req: Request, res: Response, next: NextFunction) => {
      const postServiceInstance = Container.get(PostService);

      try {
        const post = await postServiceInstance.likePost(
          req.params.postId,
          req.userId,
        );
        return res.status(200).json(post);
      } catch (error) {
        return next(error);
      }
    },
  );

  /**
   * @swagger
   *
   * /api/posts/likesOf/{postId}:
   *   get:
   *     tags: [Post]
   *     summary: Returns people who likes the post
   *     produces:
   *       - application/json
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: postId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of post
   *     responses:
   *       200:
   *         description: Ok
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Post not found
   */

  route.get(
    '/likesOf/:postId',
    middlewares.auth,
    async (req: Request, res: Response, next: NextFunction) => {
      const postServiceInstance = Container.get(PostService);

      try {
        const response = await postServiceInstance.getLikes(req.params.postId);
        return res.status(200).json(response);
      } catch (error) {
        return next(error);
      }
    },
  );

  /**
   * @swagger
   *
   * /api/posts/of/{postsOwnerId}:
   *   get:
   *     tags: [Post]
   *     summary: Returns posts of a user
   *     produces:
   *       - application/json
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: postsOwnerId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of posts owner
   *     responses:
   *       200:
   *         description: Ok
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: User not found
   */

  route.get(
    '/of/:postsOwnerId',
    middlewares.auth,
    async (req: Request, res: Response, next: NextFunction) => {
      const postServiceInstance = Container.get(PostService);

      try {
        const response = await postServiceInstance.getPostsOf(
          req.userId,
          req.params.postsOwnerId,
        );
        return res.status(200).json(response);
      } catch (error) {
        return next(error);
      }
    },
  );
};
