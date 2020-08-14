// eslint-disable-next-line object-curly-newline
import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import { body, validationResult } from 'express-validator';
import CommentService from '../../services/comment.service';
import middlewares from '../middlewares/index';

const route = Router();

export default (app: Router): void => {
  app.use('/comment', route);

  route.get(
    '/:commentId',
    middlewares.auth,
    async (req: Request, res: Response, next: NextFunction) => {
      const commentServiceInstance = Container.get(CommentService);

      try {
        const response = await commentServiceInstance.getComment(
          req.params.commentId,
        );

        return res.send(response);
      } catch (error) {
        return next(error);
      }
    },
  );

  route.post(
    '/comment-post/:postId',
    middlewares.auth,
    body('content', "Ooops! Don't forget to write something...").notEmpty(),
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const commentServiceInstance = Container.get(CommentService);

      const commentForCreateDTO = {
        user: req.userId,
        postId: req.params.postId,
        ...req.body,
      };

      try {
        await commentServiceInstance.commentPost(commentForCreateDTO);
        return res.status(201).end();
      } catch (error) {
        return next(error);
      }
    },
  );

  route.post(
    '/comment-comment/:commentId',
    middlewares.auth,
    body('content', "Ooops! Don't forget to write something...").notEmpty(),
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const commentServiceInstance = Container.get(CommentService);

      const commentForCreateDTO = {
        user: req.userId,
        commentId: req.params.commentId,
        ...req.body,
      };

      try {
        await commentServiceInstance.commentComment(commentForCreateDTO);
        return res.status(201).end();
      } catch (error) {
        return next(error);
      }
    },
  );

  route.delete(
    '/:commentId',
    middlewares.auth,
    async (req: Request, res: Response, next: NextFunction) => {
      const commentServiceInstance = Container.get(CommentService);

      try {
        await commentServiceInstance.deleteComment(req.params.commentId);
        return res.status(204).end();
      } catch (error) {
        return next(error);
      }
    },
  );

  route.post(
    '/like/:commentId',
    middlewares.auth,
    async (req: Request, res: Response, next: NextFunction) => {
      const commentServiceInstance = Container.get(CommentService);

      try {
        await commentServiceInstance.likeComment(
          req.params.commentId,
          req.userId,
        );
        return res.status(204).end();
      } catch (error) {
        return next(error);
      }
    },
  );
};
