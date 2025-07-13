import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { Request } from 'express';

@UseGuards(JwtGuard, RoleGuard)
@Roles(Role.USER)
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}
  @Get()
  @Header('Cache-Control', 'no-store')
  @Header('Pragma', 'no-cache')
  getCheckoutSession(@Req() request: Request) {
    // console.log(request.headers['checkout_session_id']);
    const checkoutSessionId = request.headers['checkout_session_id'] as string;

    // console.log('Session ID:', request.headers['checkout_session_id']);

    if (!checkoutSessionId)
      throw new NotFoundException('No checkout session found');

    // Assuming the checkoutService has a method to get the session by ID
    return this.checkoutService.getCheckoutSession(checkoutSessionId);
  }
}
