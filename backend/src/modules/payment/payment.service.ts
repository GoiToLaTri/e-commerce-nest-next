import { appConfig } from '@/common/configs';
import { BadRequestException, GoneException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import { RedisService } from '../redis/redis.service';
import { ICheckoutSession } from '../checkout-session/interfaces/checkout-session.interface';
import { OrdersService } from '../orders/orders.service';
import { CheckoutSessionService } from '../checkout-session/checkout-session.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly ordersService: OrdersService,
    private readonly checkoutSessionService: CheckoutSessionService,
  ) {}
  async momoMethod(sessionId: string) {
    const checkoutSessionDataRaw: string | null =
      await this.redis.get(sessionId);
    if (!checkoutSessionDataRaw)
      throw new GoneException('Session expired or does not exist.');
    const checkoutSessionData: ICheckoutSession = JSON.parse(
      checkoutSessionDataRaw,
    ) as ICheckoutSession;

    const requestId = `${checkoutSessionData.id}-${Date.now()}`;
    const extraData = Buffer.from(JSON.stringify({ sessionId })).toString(
      'base64',
    );
    const requestType = 'payWithMethod';

    // **Tạo raw signature**
    const rawSignature = `accessKey=${appConfig.MOMO_ACCESS_KEY}&amount=${
      checkoutSessionData.totalAmount +
      (checkoutSessionData.shippingInfo?.shippingfee || 0)
    }&extraData=${extraData}&ipnUrl=${`${appConfig.BACKEND_URL}/${appConfig.MOMO_IPN_URL}`}&orderId=${requestId}&orderInfo=${`Payment order ${checkoutSessionData.id}`}&partnerCode=${appConfig.MOMO_PARTNER_CODE}&redirectUrl=${`${appConfig.BACKEND_URL}/${appConfig.MOMO_REDIRECT_URL}`}&requestId=${requestId}&requestType=${requestType}`;

    // **Tạo chữ ký HMAC SHA256**
    const signature = crypto
      .createHmac('sha256', appConfig.MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest('hex');

    // console.log('signature', signature);

    // **Chuẩn bị dữ liệu gửi**
    const requestBody = JSON.stringify({
      partnerCode: appConfig.MOMO_PARTNER_CODE,
      //   accessKey: appConfig.MOMO_ACCESS_KEY,
      requestId,
      amount:
        checkoutSessionData.totalAmount +
        (checkoutSessionData.shippingInfo?.shippingfee || 0),
      orderId: requestId,
      orderInfo: `Payment order ${checkoutSessionData.id}`,
      redirectUrl: `${appConfig.BACKEND_URL}/${appConfig.MOMO_REDIRECT_URL}`,
      ipnUrl: `${appConfig.BACKEND_URL}/${appConfig.MOMO_IPN_URL}`,
      extraData,
      requestType,
      signature,
      lang: 'vi',
    });

    try {
      // **Gửi request đến Momo bằng Axios**
      console.log('Sending request to Momo...');
      const response = await axios.post(appConfig.MOMO_API_URL, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody),
        },
      });

      // console.log('Response from Momo:', response.data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('Error from Momo:', error.response?.data || error.message);
      throw new BadRequestException('Momo payment request failed');
    }
  }

  momoRefund() {
    console.log('Refund');
  }

  async processPayment(payload: { extraData: string; resultCode: string }) {
    if (!payload) return;
    // console.log(payload);

    const extraDataString = Buffer.from(payload.extraData, 'base64').toString(
      'utf-8',
    );
    const extraDataParse: { sessionId: string } = JSON.parse(
      extraDataString,
    ) as { sessionId: string };

    // console.log(extraDataParse.sessionId);

    const session: ICheckoutSession =
      (await this.checkoutSessionService.findByCheckoutSessionId(
        extraDataParse.sessionId,
      )) as unknown as ICheckoutSession;

    if (payload.resultCode == '0') {
      // console.log(payload.extraData);

      const result = await this.ordersService.create(session, 'SUCCESS');
      if (!result) return;

      // const successCondition =
      //   result[0].orderStatus === 'PROCESSING' &&
      //   result[0].paymentStatus === 'SUCCESS';
      // console.log('successCondition', successCondition);
      // if (successCondition)
      return `${appConfig.FRONTEND_URL}/payment-result/${result[0].sessionId}/result`;
    }
    const result = await this.ordersService.create(session, 'FAILED');
    if (!result) return;

    // const successCondition =
    //   result[0].orderStatus === 'PROCESSING' &&
    //   result[0].paymentStatus === 'SUCCESS';
    // console.log('successCondition', successCondition);
    // if (successCondition)
    return `${appConfig.FRONTEND_URL}/payment-result/${result[0].sessionId}/result`;
  }
}
