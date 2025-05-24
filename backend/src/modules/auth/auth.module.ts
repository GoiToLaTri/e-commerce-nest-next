import { Module } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { UserModule } from '@/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { appConfig } from '@/common/configs';
import { AuthController } from './auth.controller';
import { JwtStrategy, LocalStrategy } from './strategys';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    UserModule,
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
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
