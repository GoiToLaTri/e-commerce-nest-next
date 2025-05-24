import { AuthService } from '@/modules/auth/auth.service';
import { IUser } from '@/modules/user/interfaces';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  // This strategy is used to validate local authentication (username/password)
  constructor(private readonly authService: AuthService) {
    // Implement your local strategy logic here
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<IUser> {
    const user = await this.authService.validateUser(username, password);

    // Implement your local validation logic here
    if (!user) throw new UnauthorizedException();
    return user; // Placeholder for actual validation
  }
}
