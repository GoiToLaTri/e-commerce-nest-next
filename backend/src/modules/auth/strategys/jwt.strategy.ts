import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { appConfig } from '../../../common/configs';
import { AccessTokenPayload } from '@/modules/auth/types';
import { RedisService } from '@/modules/redis/redis.service';
import { SessionData } from '@/modules/session/interfaces';
import { SessionService } from '@/modules/session/session.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly redis: RedisService,
    private readonly sessionService: SessionService,
  ) {
    // This strategy is used to validate JWT tokens
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.JWT_SECRET,
    });
  }

  async validate(
    payload: AccessTokenPayload,
  ): Promise<Partial<SessionData> | null> {
    // Implement your JWT validation logic here
    const sessionStr: string | null = await this.redis.get(payload.session_id);
    let session: SessionData | null = null;

    if (sessionStr) {
      try {
        session = JSON.parse(sessionStr) as SessionData;
        // console.log(new Date(session.expires_at).getTime(), Date.now());
        // Nếu session đã hết hạn thì xóa và trả về null
        if (new Date(session.expires_at).getTime() < Date.now()) {
          // console.log(`Session expired: ${payload.session_id}`);
          await this.redis.del(payload.session_id);
          return null;
        }

        return session; // session còn hạn
      } catch (err) {
        console.error(err);
        // Trường hợp Redis có dữ liệu nhưng không parse được
        await this.redis.del(payload.session_id);
        return null;
      }
    }

    console.log(
      `Session not found in Redis, falling back to database: ${payload.session_id}`,
    );
    const fallbackSession = (await this.sessionService.findBySessionId(
      payload.session_id,
    )) as SessionData | null;
    if (!fallbackSession) return null;
    if (new Date(fallbackSession.expires_at).getTime() < Date.now()) {
      await this.sessionService.removeBySessionId(fallbackSession.session_id);
      return null;
    }

    await this.redis.set(
      fallbackSession.session_id,
      JSON.stringify({
        ...fallbackSession,
        updated_at: undefined, // Exclude updated_at from session data
        user: {
          ...fallbackSession.user,
          password: undefined, // Exclude password from session data
          updated_at: undefined, // Exclude updated_at from user dataF
        },
      }),
      appConfig.REDIS_SESSION_EXPIRE,
    );

    return fallbackSession;
  }
}
