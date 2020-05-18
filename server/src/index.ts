import express, { Application } from 'express';
import config from './config';

const startServer = async () => {
  const app: Application = express();

  await require('./loaders').default({ expressApp: app });
  
  app.listen(config.port, () => {
    console.log(`Server listening at http://localhost:${config.port} 🌎`);
  });
}

startServer();