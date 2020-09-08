// eslint-disable-next-line object-curly-newline
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import routes from '../api';
import { HttpError } from '../helpers/errors';
import middlewares from '../api/middlewares';

export default ({ app }: { app: Application }): void => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Blitster API',
        version: '1.0.0',
        description: 'An social network API',
        contact: {
          name: 'Luis Manuel González',
        },
      },
    },
    // Path to the API docs
    apis: ['dist/interfaces/*.js', 'dist/api/routes/*.js'],
  };

  // Initialize swagger-jsdoc -> returns validated swagger spec in json format
  const swaggerSpec = swaggerJSDoc(options);

  // middlewares
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // static files
  app.use(
    '/uploads',
    middlewares.auth,
    express.static(path.resolve('uploads')),
  );

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/api', routes());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const { status, message } = err;

    return res
      .status(status || 500)
      .json({ message: message || 'Internal server error' });
  });
};
