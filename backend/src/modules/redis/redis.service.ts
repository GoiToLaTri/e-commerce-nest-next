import { appConfig } from '@/common/configs';
import { logger } from '@/common/utils';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly redis: Redis;
  private readonly pubClient: Redis;
  private readonly subClient: Redis;

  constructor() {
    this.redis = new Redis({
      host: appConfig.REDIS_HOST,
      port: Number(appConfig.REDIS_PORT),
      username: appConfig.REDIS_USERNAME,
      password: appConfig.REDIS_PASSWORD,
    });
    // this.pubClient = this.redis.duplicate();
    // this.subClient = this.pubClient.duplicate();
  }

  onModuleInit() {
    this.redis.on('ready', () => {
      logger.green('Redis main client ready');
    });
    this.redis.on('error', (err) => {
      console.error(`\x1B[31mRedis main client error:\x1B[0m`, err);
    });

    // this.pubClient.on('ready', () => {
    //   logger.green('Redis pubClient ready');
    // });
    // this.pubClient.on('error', (err) => {
    //   console.error(`\x1B[31mRedis pubClient error:\x1B[0m`, err);
    // });

    // this.subClient.on('ready', () => {
    //   logger.green('Redis subClient ready');
    // });
    // this.subClient.on('error', (err) => {
    //   console.error(`\x1B[31mRedis subClient error:\x1B[0m`, err);
    // });
  }

  async onModuleDestroy() {
    await Promise.all([
      this.redis.quit(),
      // this.pubClient.quit(),
      // this.subClient.quit(),
    ]);
    logger.red('All Redis connections closed');
  }

  getRedis() {
    return this.redis;
  }

  getPubClient() {
    return this.pubClient;
  }

  getSubClient() {
    return this.subClient;
  }

  async set(key: string, value: any, expirationInSeconds?: number) {
    if (expirationInSeconds)
      await this.redis.set(
        key,
        JSON.stringify(value),
        'EX',
        expirationInSeconds,
      );
    else await this.redis.set(key, JSON.stringify(value), 'EX', 60 * 60);
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (value) return JSON.parse(value) as T;
    return null;
  }

  async del(key: string) {
    const keys = await this.redis.keys(key);
    if (keys.length) await this.redis.del(...keys);
  }
}
