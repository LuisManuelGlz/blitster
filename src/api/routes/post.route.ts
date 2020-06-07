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
import { PostForListDTO } from '../../interfaces/post';

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

  route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const postServiceInstance: PostService = Container.get(PostService);

    try {
      const response: PostForListDTO[] = await postServiceInstance.getPosts();
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  });

  route.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.send('ok');
    } catch (error) {
      return next(error);
    }
  });

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

      const postServiceInstance: PostService = Container.get(PostService);

      try {
        const images = JSON.parse(JSON.stringify(req.files)).map(
          (file: Express.Multer.File) => `/uploads/${file.filename}`,
        );
        const postForCreateDTO = {
          user: req.userId,
          images,
          ...req.body,
        };
        await postServiceInstance.createPost(postForCreateDTO);
        return res.send('ok');
      } catch (error) {
        return next(error);
      }
    },
  );
};
