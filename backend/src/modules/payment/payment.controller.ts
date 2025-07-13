import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Post('momo-method')
  momoMethod(@Req() request: Request) {
    const checkoutSessionId = request.headers['checkout_session_id'] as string;
    return this.paymentService.momoMethod(checkoutSessionId);
  }

  @Post('momo/webhook')
  handleMomoWebhook(@Body() body: any, @Res() res: Response) {
    try {
      // console.log('Nhận dữ liệu Webhook:', body);
      return res.status(HttpStatus.OK).json({ message: 'Webhook received' });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error(error.message);
      throw new InternalServerErrorException();
    }
  }

  @Get('momo/redirect')
  async handleMomoRedirect(@Query() query: any, @Res() res: Response) {
    try {
      // console.log('Nhận dữ liệu Redirect:', query);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await this.paymentService.processPayment(query);
      // console.log(result);
      if (result) return res.redirect(result);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error(error.message);
      throw new InternalServerErrorException();
    }
  }
}
