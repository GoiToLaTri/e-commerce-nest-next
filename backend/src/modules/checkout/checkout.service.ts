import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { CheckoutSessionService } from '../checkout-session/checkout-session.service';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly redis: RedisService,
    private readonly checkoutSessionService: CheckoutSessionService,
  ) {}
  async getCheckoutSession(checkoutSessionId: string) {
    const session: string | null = await this.redis.get(checkoutSessionId);
    if (!session) throw new NotFoundException('No checkout session found');
    const parsedSession = JSON.parse(session) as {
      id: string;
      expiredAt?: Date | string;
    };
    if (
      parsedSession.expiredAt &&
      Date.now() > new Date(parsedSession.expiredAt).getTime()
    ) {
      await this.redis.del(checkoutSessionId);
      throw new GoneException('Checkout session has expired');
    }
    return parsedSession;
  }
}
