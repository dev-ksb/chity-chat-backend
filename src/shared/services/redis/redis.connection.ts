import { config } from '@root/config';
import Logger from 'bunyan';
import { BaseCache } from '@service/redis/base.cache';

const log: Logger = config.createLogger('redisConnection');

class RedisConnection extends BaseCache {
  constructor() {
    super('redisConnection');
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error: unknown) {
      log.error(error);
    }
  }
}

export const redisConnection: RedisConnection = new RedisConnection();
