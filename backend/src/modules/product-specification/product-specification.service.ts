import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { appConfig } from '@/common/configs/app.config';

@Injectable()
export class ProductSpecificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findManyRam() {
    const cacheKey = 'product-specification-ram';
    const cache: string | null = await this.redis.get(cacheKey);
    if (cache) return JSON.parse(cache) as { id: string; name: string }[];

    const data = await this.prisma.memory.findMany();
    await this.redis.set(
      cacheKey,
      JSON.stringify(data),
      appConfig.REDIS_TTL_CACHE,
    );

    return data;
  }

  async findManyStorage() {
    const cacheKey = 'product-specification-storage';
    const cache: string | null = await this.redis.get(cacheKey);
    if (cache) return JSON.parse(cache) as { id: string; name: string }[];

    const data = await this.prisma.storage.findMany();
    await this.redis.set(
      cacheKey,
      JSON.stringify(data),
      appConfig.REDIS_TTL_CACHE,
    );

    return data;
  }

  async findManyGpu() {
    const cacheKey = 'product-specification-gpu';
    const cache: string | null = await this.redis.get(cacheKey);
    if (cache) return JSON.parse(cache) as { id: string; name: string }[];

    const data = await this.prisma.videoGraphics.findMany();
    await this.redis.set(
      cacheKey,
      JSON.stringify(data),
      appConfig.REDIS_TTL_CACHE,
    );

    return data;
  }

  async findManyCpu() {
    const cacheKey = 'product-specification-cpu';
    const cache: string | null = await this.redis.get(cacheKey);
    if (cache) return JSON.parse(cache) as { id: string; name: string }[];

    const data = await this.prisma.processor.findMany();
    await this.redis.set(
      cacheKey,
      JSON.stringify(data),
      appConfig.REDIS_TTL_CACHE,
    );

    return data;
  }
}
