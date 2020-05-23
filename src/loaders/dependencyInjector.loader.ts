import { Container } from 'typedi';
import nodemailer from 'nodemailer';
import config from '../config';

export default (): void => {
  const transporter = nodemailer.createTransport({
    host: config.mailerHost,
    port: config.mailerPort,
    secure: false,
    auth: {
      user: config.mailerUser,
      pass: config.mailerPass,
    },
  });

  Container.set('emailClient', transporter);
};
