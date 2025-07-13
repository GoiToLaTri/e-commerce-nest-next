import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrdersModule } from '../orders/orders.module';
import { CheckoutSessionModule } from '../checkout-session/checkout-session.module';

@Module({
  imports: [OrdersModule, CheckoutSessionModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
