import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { appConfig } from '@/common/configs';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: appConfig.JWT_SECRET,
          signOptions: {
            expiresIn: appConfig.JWT_EXPIRES_IN,
          },
        };
      },
    }),
    SessionModule,
  ],
  controllers: [],
  providers: [ChatGateway],
})
export class ChatModule {}
