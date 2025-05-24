import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Payload } from '@/modules/chat/interfaces';
import { AuthWsMiddleware } from './middlewares/authws.middleware';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { SessionService } from '../session/session.service';
import { IUser } from '../user/interfaces';

@WebSocketGateway({
  cors: true,
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly sessionService: SessionService,
  ) {}
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    server.use(
      AuthWsMiddleware(this.jwtService, this.redisService, this.sessionService),
    );

    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket<IUser>) {
    console.log('User connected:', client.id);
    console.log('client', client);
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: Payload) {
    console.log('Client:', client.id);
    console.log('Message received:', payload);
    // Broadcast message to the room
    this.server.to(payload.room).emit('message', payload);
  }

  @SubscribeMessage('message:private')
  handlePrivateMessage(
    client: Socket,
    payload: { to: string; message: string },
  ) {
    console.log(
      `Private message from ${client.id} to ${payload.to}: ${payload.message}`,
    );
    // Send the private message to the recipient socket
    this.server.to(payload.to).emit('message:private', {
      from: client.id,
      message: payload.message,
    });
  }
}
