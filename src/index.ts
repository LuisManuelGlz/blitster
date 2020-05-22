import express, { Application } from 'express';
import loaders from './loaders';
import config from './config';

const startServer = (): void => {
  const app: Application = express();

  loaders({ expressApp: app });

  app.listen(config.port, () => {
    console.log(`Server listening at http://localhost:${config.port} 🌎`);
  });
};

startServer();
