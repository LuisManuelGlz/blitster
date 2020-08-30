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
   * GET posts
   * @description Get all posts
   * @response 200 - OK
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
   * POST posts
   * @description Create a post
   * @response 201 - Created
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
   * DELETE posts/{postId}
   * @description Delete a post
   * @pathParam {string} postId - ID of post
   * @response 204 - No Content
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
   * POST posts/like/{postId}
   * @description Returns the post liked
   * @pathParam {string} postId - ID of post
   * @response 200 - OK
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
   * GET posts/likesOf/{postId}
   * @description Returns people who likes the post
   * @pathParam {string} postId - ID of post
   * @response 200 - OK
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
   * GET posts/of/{postsOwnerId}
   * @description Returns posts of a user
   * @pathParam {string} postsOwnerId - ID of postsOwner
   * @response 200 - OK
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
