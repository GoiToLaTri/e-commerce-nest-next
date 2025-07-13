import { Controller, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':id')
  findBySessionId(@Param('id') id: string) {
    return this.ordersService.findBySessionId(id);
  }
}
