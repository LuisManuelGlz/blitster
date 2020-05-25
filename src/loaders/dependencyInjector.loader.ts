import { Container } from 'typedi';
import nodemailer from 'nodemailer';
import config from '../config';

export default ({
  models,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  models: { name: string; model: any }[];
}): void => {
  models.forEach((model) => {
    Container.set(model.name, model.model);
  });

  const transporter = nodemailer.createTransport({
    host: config.mailerHost,
    port: config.mailerPort,
    // secure: false,
    auth: {
      user: config.mailerUser,
      pass: config.mailerPass,
    },
    // tls: {
    //   rejectUnauthorized: false,
    // },
  });

  Container.set('emailClient', transporter);
};
