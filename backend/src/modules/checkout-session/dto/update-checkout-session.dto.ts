import { PartialType } from '@nestjs/mapped-types';
import { CreateCheckoutSessionDto } from './create-checkout-session.dto';

export class UpdateCheckoutSessionDto extends PartialType(
  CreateCheckoutSessionDto,
) {
  paymentMethod: string;
  shippingInfo: {
    delivery: 'shipping' | 'pickup';
    shippingfee: number;
    fullName: string;
    phone: string;
    address: string[];
    note: string;
  };
}
