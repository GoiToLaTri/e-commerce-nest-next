import { BadRequestException, Injectable } from '@nestjs/common';
import { IUser } from '@/modules/user/interfaces/user.interface';
import { UserService } from '@/modules/user/user.service';
import { argon } from '@/common/utils';
import { AccessToken } from './types';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { SessionService } from '@/modules/session/session.service';
import { RedisService } from '../redis/redis.service';
import { appConfig } from '@/common/configs';
import { SessionData } from '../session/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
    private readonly redisService: RedisService,
  ) {}
  async validateUser(email: string, password: string): Promise<IUser> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new BadRequestException('User not found');

    const isMatch = await argon.verifySync(user.password, password);
    if (!isMatch) throw new BadRequestException('Invalid credentials');

    return user;
  }

  async login(user: IUser): Promise<AccessToken> {
    const session = await this.sessionService.createSession(user.id);
    if (!session) throw new BadRequestException('Session creation failed');
    const payload = { session_id: session.session_id };

    await this.redisService.set(
      session.session_id,
      JSON.stringify({
        ...{ ...session, updated_at: undefined },
        user: { ...user, password: undefined, updated_at: undefined },
      }),
      appConfig.REDIS_SESSION_EXPIRE,
    );

    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async register(createUserDto: CreateUserDto): Promise<Partial<IUser>> {
    const user = await this.userService.findOneByEmail(createUserDto.email);
    const password = await argon.hashSync(createUserDto.password);
    const newUser = { ...createUserDto, password };
    if (user) throw new BadRequestException('User already exists');
    return { ...(await this.userService.create(newUser)), password: undefined };
  }

  async logout(session: SessionData): Promise<void> {
    await this.redisService.del('session-*');
    await this.sessionService.removeBySessionId(session.session_id);
  }
}
