import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { Request } from 'express';
import { SessionData } from '../session/interfaces';

@UseGuards(JwtGuard, RoleGuard)
@Roles(Role.USER)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(Role.ADMIN)
  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: string,
    @Query('paymentStatus[]') paymentStatusRaw: string | string[],
    @Query('orderStatus[]') orderStatusRaw: string | string[],
    @Query('search') search: string,
  ) {
    const paymentStatus = Array.isArray(paymentStatusRaw)
      ? paymentStatusRaw
      : paymentStatusRaw
        ? [paymentStatusRaw]
        : undefined;

    const orderStatus = Array.isArray(orderStatusRaw)
      ? orderStatusRaw
      : orderStatusRaw
        ? [orderStatusRaw]
        : undefined;

    return this.ordersService.findAll(
      +page || 1,
      +limit || 4,
      sortField,
      sortOrder,
      paymentStatus,
      orderStatus,
      search,
    );
  }

  @Get('client')
  findByClientId(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: string,
    @Query('paymentStatus[]') paymentStatusRaw: string | string[],
    @Query('orderStatus[]') orderStatusRaw: string | string[],
    @Query('search') search: string,
    @Req() request: Request,
  ) {
    const { session_user } = request as unknown as {
      session_user: SessionData;
    };

    const paymentStatus = Array.isArray(paymentStatusRaw)
      ? paymentStatusRaw
      : paymentStatusRaw
        ? [paymentStatusRaw]
        : undefined;

    const orderStatus = Array.isArray(orderStatusRaw)
      ? orderStatusRaw
      : orderStatusRaw
        ? [orderStatusRaw]
        : undefined;

    return this.ordersService.findByClientId(
      +page || 1,
      +limit || 4,
      sortField,
      sortOrder,
      session_user.user_id,
      paymentStatus,
      orderStatus,
      search,
    );
  }

  @Get('client/purchased')
  clientPurchased(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Req() request: Request,
  ) {
    const { session_user } = request as unknown as {
      session_user: SessionData;
    };
    return this.ordersService.clientPurchased(
      session_user.user_id,
      +page || 1,
      +limit || 4,
    );
  }

  @Get('session/:sessionId')
  findBySessionId(@Param('sessionId') id: string) {
    console.log('call here');
    return this.ordersService.findBySessionId(id);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch('status/:id')
  updateStatus(
    @Param('id') id: string,
    @Body()
    updateDto: {
      orderStatus?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
    },
  ) {
    if (!updateDto.orderStatus) return;
    const validOrderStatus = [
      'PENDING',
      'PROCESSING',
      'COMPLETED',
      'CANCELLED',
    ];

    if (!validOrderStatus.includes(updateDto.orderStatus)) return;

    return this.ordersService.updateStatus(id, updateDto.orderStatus);
  }
}
