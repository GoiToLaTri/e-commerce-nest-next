import { JwtStrategy } from '@/modules/auth/strategys';
import { AccessTokenPayload } from '@/modules/auth/types';
import { RedisService } from '@/modules/redis/redis.service';
import { SessionService } from '@/modules/session/session.service';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

export const AuthWsMiddleware = (
  jwtService: JwtService,
  redisService: RedisService,
  sessionService: SessionService,
): SocketMiddleware => {
  return (socket: Socket, next) => {
    void (async () => {
      try {
        const token: string = (socket.handshake['auth'].token ||
          socket.handshake['headers'].token) as string;

        if (!token) throw new Error('Authorization token is missing');

        let payload: AccessTokenPayload | null = null;

        try {
          payload = await jwtService.verifyAsync<AccessTokenPayload>(token);
        } catch (error) {
          console.error(error);
          throw new Error('Authorization token is invalid');
        }

        const strategy = new JwtStrategy(redisService, sessionService);
        const session = await strategy.validate(payload);
        if (!session) throw new Error('Session invalid or expired');

        // const { id, user, session_id, user_id, ...session_data } = session;

        // const {
        //   password,
        //   updated_at,
        //   email,
        //   id: usId,
        //   ...user_data
        // } = user ?? {};

        // socket = Object.assign(socket, {
        //   session: { ...session_data },
        //   user: { ...user_data },
        // });

        next();
      } catch (error) {
        if (error instanceof Error) next(new Error(error.message));
        else next(new Error('Internal Server Error'));
      }
    })();
  };
};
