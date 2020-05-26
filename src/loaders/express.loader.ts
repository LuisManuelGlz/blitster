// eslint-disable-next-line object-curly-newline
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
// import multer from 'multer';
// import path from 'path';
import routes from '../api';
import { HttpError } from '../helpers/errors';

export default ({ app }: { app: Application }): void => {
  // middlewares
  app.use(cors());
  app.use(morgan('dev'));
  // app.use(multer({ dest: path.resolve(__dirname, 'public/upload') }).single('image'));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // static files
  // app.use('/public', express.static(path.resolve(__dirname, 'public')));\

  // routes
  app.use('/api', routes());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const { status, message } = err;

    return res
      .status(status || 500)
      .json({ message: message || 'Internal server error' });
  });
};
