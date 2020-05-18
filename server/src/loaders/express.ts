import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
// import multer from 'multer';
// import path from 'path';
import routes from '../api/';

export default ({ app }: { app: Application }) => {
  
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
};