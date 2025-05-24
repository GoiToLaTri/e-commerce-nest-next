import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter, NotFoundFilter } from '@/common/filters/index';
import { appConfig } from '@/common/configs/index';
// import { RedisIoAdapter } from './adapters/redis.adapter';
import { INestApplication } from '@nestjs/common';
import { logger } from './common/utils';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new NotFoundFilter());
  // app.useWebSocketAdapter(new RedisIoAdapter(app));
  app.enableShutdownHooks();

  await app.listen(appConfig.PORT, () => {
    console.log(`Server is running on port: \x1B[33m${appConfig.PORT}\x1B[0m`);
    console.log(`Application is running on: \x1B[4;36m${appConfig.URL}\x1B[0m`);
  });

  handleExit();
}

function handleExit(app?: INestApplication): void {
  process.on('uncaughtException', (error: Error) => {
    console.error(`There was an uncaught error: ${error}`);
    void shutDownProperly(1, app);
  });

  process.on('unhandledRejection', (reason: Error) => {
    console.error(`Unhandled rejection at promise: ${reason}`);
    void shutDownProperly(2, app);
  });

  process.on('SIGTERM', () => {
    console.error('Caught SIGTERM');
    void shutDownProperly(2, app);
  });

  process.on('SIGINT', () => {
    console.error('Caught SIGINT');
    void shutDownProperly(2, app);
  });
}

async function shutDownProperly(
  exitCode: number,
  app?: INestApplication,
): Promise<void> {
  try {
    console.log('Shutdown initiated...');
    // Bạn có thể add logic đóng DB, Redis, Kafka nếu chưa dùng onApplicationShutdown
    if (app) await app.close();
    logger.green('Shutdown complete');
    process.exit(exitCode);
  } catch (error) {
    console.error(`\x1B[31mError during shutdown:\x1B[0m`, error);
    process.exit(1);
  }
}

void bootstrap();
