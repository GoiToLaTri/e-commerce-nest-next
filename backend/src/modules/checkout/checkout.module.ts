import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { CheckoutSessionModule } from '../checkout-session/checkout-session.module';

@Module({
  imports: [CheckoutSessionModule],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
