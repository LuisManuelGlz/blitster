import dotenv from 'dotenv';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("⚠️ Couldn't find .env file ⚠️");
}

export default {
  port: parseInt(process.env.PORT, 10),
  databaseUri: process.env.MONGODB_URI,
  mailerHost: process.env.MAILER_HOST,
  mailerPort: parseInt(process.env.MAILER_PORT, 10),
  mailerUser: process.env.MAILER_USER,
  mailerPass: process.env.MAILER_PASS,
};
