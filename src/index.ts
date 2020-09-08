import express, { Application } from 'express';
import chalk from 'chalk';
import loaders from './loaders';
import config from './config';

const startServer = async (): Promise<void> => {
  const app: Application = express();

  await loaders({ expressApp: app });

  app.listen(config.port, () => {
    console.log(
      `Server listening at ${chalk.underline.blue(
        `http://localhost:${config.port}`,
      )} 🌎`,
    );
    console.log(
      `Open docs at ${chalk.underline.blue(
        `http://localhost:${config.port}/api-docs`,
      )} 📃`,
    );
  });
};

startServer();
