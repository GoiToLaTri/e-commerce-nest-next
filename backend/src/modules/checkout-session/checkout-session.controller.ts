import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { CheckoutSessionService } from './checkout-session.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { UpdateCheckoutSessionDto } from './dto/update-checkout-session.dto';
import { Request, Response } from 'express';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { SessionData } from '../session/interfaces';

@UseGuards(JwtGuard, RoleGuard)
@Roles(Role.USER)
@Controller('checkout-session')
export class CheckoutSessionController {
  constructor(
    private readonly checkoutSessionService: CheckoutSessionService,
  ) {}

  @Post()
  async create(
    @Req() request: Request,
    @Res() response: Response,
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
  ) {
    const { session_user } = request as unknown as {
      session_user: SessionData;
    };
    const checkoutSessionData = await this.checkoutSessionService.create(
      createCheckoutSessionDto,
      session_user.user_id,
    );
    if (!checkoutSessionData) {
      return response.status(400).json({ message: 'No products selected' });
    }
    response.cookie('checkout_session_id', checkoutSessionData.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure flag in production
      sameSite: 'strict', // Adjust as needed
      maxAge: 30 * 60 * 1000, // 30 minutes
    });
    return response.status(201).json({
      message: 'Checkout session created successfully',
      checkout_session_id: checkoutSessionData.id,
    });
  }

  @Get()
  findAll() {
    return this.checkoutSessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkoutSessionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCheckoutSessionDto: UpdateCheckoutSessionDto,
  ) {
    return this.checkoutSessionService.update(id, updateCheckoutSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkoutSessionService.remove(+id);
  }
}
