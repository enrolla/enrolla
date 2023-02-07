import { Injectable, Logger } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Redis } from 'ioredis';

@Injectable()
export class PubSubService {
  private _pubSub: PubSub | RedisPubSub;
  private logger = new Logger(PubSubService.name);

  constructor() {
    const url = process.env.REDIS_URL;
    if (url) {
      this.logger.log('PubSub Redis URL supplied, using RedisPubSub - ', url);

      const ioRedisOptions = {
        lazyConnect: true,
        maxRetriesPerRequest: 5,
      };

      const redis = new Redis(url, ioRedisOptions);
      redis.connect().catch((error) => {
        this.logger.error(
          'Failed to initialize RedisPubSub, reverting to in memory PubSub',
          error?.stack
        );
        redis.disconnect();
        this._pubSub = new PubSub();
      });

      this._pubSub = new RedisPubSub({
        publisher: redis,
        subscriber: new Redis(url, ioRedisOptions),
      });
    } else {
      this.logger.log('No PubSub Redis URL supplied, using in memory PubSub');
      this._pubSub = new PubSub();
    }
  }

  public get pubSub() {
    return this._pubSub;
  }
}
