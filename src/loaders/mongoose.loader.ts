import mongoose from 'mongoose';
import config from '../config';

export default async (): Promise<void> => {
  await mongoose.connect(config.databaseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
