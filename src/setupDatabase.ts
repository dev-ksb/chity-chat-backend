import Logger from 'bunyan';
import mongoose from 'mongoose';
import { config } from '@root/config';
import { redisConnection } from '@service/redis/redis.connection';

const log: Logger = config.createLogger('database');

export default () => {
  const connect = () => {
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        log.info('Successfully connected to database');

        redisConnection.connect();
      })
      .catch((error) => {
        log.info('Error connecting to database', error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};
