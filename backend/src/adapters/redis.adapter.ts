import { RedisService } from '@/modules/redis/redis.service';
import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server, ServerOptions } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  private readonly redisAdapter: ReturnType<typeof createAdapter>;

  constructor(private readonly app: INestApplication) {
    super(app);
    const redisService = app.get(RedisService);

    this.redisAdapter = createAdapter(
      redisService.getPubClient(),
      redisService.getSubClient(),
    );
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    console.log('Creating Redis IoServer');
    const server = super.createIOServer(port, options) as Server;
    server.adapter(this.redisAdapter);
    return server;
  }
}
