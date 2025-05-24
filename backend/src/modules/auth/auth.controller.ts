import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Public } from './decorators';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { IUser } from '../user/interfaces';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request) {
    // Implement your login logic here
    return this.authService.login(req.user as IUser);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // Implement your registration logic here
    return this.authService.register(createUserDto);
  }

  //   @Public()
  //   @Post('logout')
  //   async logout(@Request() req: any) {
  //     // Implement your logout logic here
  //     return this.authService.logout(req.user);
  //   }
}
