import { appConfig } from '@/common/configs';
import { logger } from '@/common/utils';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ datasources: { db: { url: appConfig.DB_URL } } });
  }

  async onModuleInit() {
    await this.$connect();
    logger.green('Prisma connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    logger.red('Prisma disconnected');
  }
}
