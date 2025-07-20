import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Public } from './decorators';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { IUser } from '../user/interfaces';
import { SessionData } from '../session/interfaces';
import { JwtGuard } from './guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request, @Res() response: Response) {
    // console.log('Login request received:', req.user);
    const access_token = await this.authService.login(req.user as IUser);
    response.cookie('access_token', access_token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure flag in production
      sameSite: 'strict', // Adjust as needed
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return response.status(200).json({
      message: 'Login successful',
      access_token: access_token.access_token,
    });
  }

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // Implement your registration logic here
    return this.authService.register(createUserDto);
  }

  @Post('logout')
  logout(@Req() req: { session_user: SessionData }) {
    // Implement your logout logic here
    // console.log(req.session_user);
    return this.authService.logout(req.session_user);
  }

  @Get('user-session')
  getUserSession(@Req() request: Request) {
    const { session_user } = request as unknown as {
      session_user: SessionData;
    };
    console.log(session_user);
    return { session_user };
  }
}
