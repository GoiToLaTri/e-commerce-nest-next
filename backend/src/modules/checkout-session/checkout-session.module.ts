import { Module } from '@nestjs/common';
import { CheckoutSessionService } from './checkout-session.service';
import { CheckoutSessionController } from './checkout-session.controller';

@Module({
  controllers: [CheckoutSessionController],
  providers: [CheckoutSessionService],
  exports: [CheckoutSessionService],
})
export class CheckoutSessionModule {}
