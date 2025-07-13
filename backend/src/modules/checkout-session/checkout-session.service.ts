import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { UpdateCheckoutSessionDto } from './dto/update-checkout-session.dto';
import { nanoid } from 'nanoid';
import { PrismaService } from '../prisma/prisma.service';
import { ObjectId } from 'mongodb';
import { Cron } from '@nestjs/schedule';
import { phoneUtil } from '@/common/utils';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CheckoutSessionService {
  private readonly logger = new Logger('CheckoutCronService');
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}
  async create(
    createCheckoutSessionDto: CreateCheckoutSessionDto,
    userId: string,
  ) {
    if (
      !createCheckoutSessionDto.products ||
      createCheckoutSessionDto.products.length === 0
    )
      throw new BadRequestException('No products selection');
    const productIds = createCheckoutSessionDto.products.map(
      (product) => product.productId,
    );

    for (const product of createCheckoutSessionDto.products)
      if (!ObjectId.isValid(product.productId))
        throw new BadRequestException('No products found');

    const inventories = await this.prisma.inventory.findMany({
      where: { productId: { in: productIds } },
      select: {
        quantity: true,
        productId: true,
        product: { select: { price: true, model: true, thumbnail: true } },
      },
    });

    const productError: string[] = [];

    if (inventories.length === 0)
      throw new BadRequestException('No products found');

    // Sometime error
    if (inventories.length !== productIds.length) {
      const foundIds = inventories.map((inv) => inv.productId);
      // console.log(foundIds);
      const notFoundIds = productIds.filter((id) => !foundIds.includes(id));
      // console.log(notFoundIds);
      productError.push(...notFoundIds.map((id) => `Product ${id} not found`));
    }
    let totalAmount: number = 0;
    for (const product of createCheckoutSessionDto.products) {
      const inventory = inventories.find(
        (inv) => inv.productId === product.productId,
      );
      if (!inventory) continue;
      if (product.quantity > inventory.quantity)
        productError.push(
          `Product ${inventory.product.model} is out of stock or not enough quantity`,
        );
      totalAmount += product.quantity * inventory.product.price;
    }
    if (productError.length > 0) throw new BadRequestException(productError[0]);

    const checkout_session_id = `checkout-session-${nanoid(16)}-${Date.now()}`;
    const expiredAt = new Date(Date.now() + 10 * 60 * 1000);

    await Promise.all(
      createCheckoutSessionDto.products.map((product) =>
        this.prisma.inventory.update({
          where: { productId: product.productId },
          data: { quantity: { decrement: product.quantity } },
        }),
      ),
    );

    const checkoutSessionData = await this.prisma.checkoutSession.create({
      data: {
        sessionId: checkout_session_id,
        expiredAt,
        products: JSON.parse(
          JSON.stringify(
            inventories.map((inv) => {
              const productDto = createCheckoutSessionDto.products.find(
                (p) => p.productId === inv.productId,
              );

              return {
                productId: inv.productId,
                quantity: productDto?.quantity || 0,
                model: inv.product.model,
                thumbnail: inv.product.thumbnail,
                price: inv.product.price,
              };
            }),
          ),
        ) as {
          productId: string;
          quantity: number;
          model: string;
          thumbnail: string;
          price: number;
        }[],
        totalAmount,
        userId,
      },
    });

    await this.redis.set(
      checkout_session_id,
      JSON.stringify(checkoutSessionData),
      15 * 60,
    );

    return checkoutSessionData;
  }

  findAll() {
    return `This action returns all checkoutSession`;
  }

  findOne(id: number) {
    return `This action returns a #${id} checkoutSession`;
  }

  async update(id: string, updateCheckoutSessionDto: UpdateCheckoutSessionDto) {
    if (!ObjectId.isValid(id)) {
      throw new NotFoundException('Session not found');
    }

    const session = await this.prisma.checkoutSession.findUnique({
      where: { id },
    });

    if (!session)
      throw new NotFoundException(`Checkout session ${id} not found`);

    if (session.isUpdate) return session;

    if (!updateCheckoutSessionDto)
      throw new BadRequestException('Checkout data is required');

    const { shippingInfo, paymentMethod } = updateCheckoutSessionDto;

    if (!shippingInfo)
      throw new BadRequestException('Shipping info is required');

    if (!shippingInfo.fullName || !shippingInfo.fullName.trim())
      throw new BadRequestException('Full name is required');

    if (!shippingInfo.address || shippingInfo.address.length !== 2)
      throw new BadRequestException('Address is required');

    if (!shippingInfo.phone || !shippingInfo.phone.trim())
      throw new BadRequestException('Phone is required');

    if (!phoneUtil.isPhone(shippingInfo.phone))
      throw new BadRequestException('Phone number is invalid');

    // Chuẩn hóa số điện thoại
    const formattedPhone = phoneUtil.phoneFormat(shippingInfo.phone);

    const updateData: {
      shippingInfo?: {
        delivery: 'shipping' | 'pickup';
        shippingfee: number;
        fullName: string;
        phone: string;
        address: string[];
        note: string;
      };
      paymentMethod?: string;
      expiredAt?: Date | string;
    } = {};

    updateData.shippingInfo = {
      delivery: shippingInfo.delivery,
      shippingfee: shippingInfo.shippingfee,
      fullName: shippingInfo.fullName.trim(),
      phone: formattedPhone,
      address: shippingInfo.address,
      note: shippingInfo.note?.trim() || '',
    };

    const validPaymentMethod = ['momo'];

    if (!paymentMethod)
      throw new BadRequestException('Payment method is required');

    if (!validPaymentMethod.includes(paymentMethod))
      throw new BadRequestException('Payment method invalid');

    if (paymentMethod && paymentMethod.trim())
      updateData.paymentMethod = paymentMethod.trim();

    const expiredAt = new Date(Date.now() + 30 * 60 * 1000);

    const updated = await this.prisma.checkoutSession.update({
      where: { id },
      data: { ...updateData, isUpdate: true, expiredAt },
    });
    await this.redis.del(updated.sessionId);
    await this.redis.set(updated.sessionId, JSON.stringify(updated), 35 * 60);
    // console.log(updated);
    return {
      message: 'Checkout session updated successfully',
      data: updated,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} checkoutSession`;
  }

  findByCheckoutSessionId(checkoutSessionId: string) {
    if (!checkoutSessionId) return null;
    return this.prisma.checkoutSession.findUnique({
      where: { sessionId: checkoutSessionId },
    });
  }

  @Cron('0 */15 * * * *')
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async rollbackExpiredSessions() {
    const now = new Date();

    const expiredSessions = await this.prisma.checkoutSession.findMany({
      where: {
        expiredAt: { lt: now },
        isPaid: false,
        isCancelled: false,
      },
    });

    this.logger.log(
      `Found ${expiredSessions.length} expired checkout sessions`,
    );

    if (expiredSessions.length === 0) return;
    for (const session of expiredSessions) {
      try {
        const products = session.products as Array<{
          productId: string;
          quantity: number;
        }>;

        for (const item of products) {
          await this.prisma.inventory.update({
            where: { productId: item.productId },
            data: { quantity: { increment: item.quantity } },
          });
          this.logger.log(
            `Rolled back stock for product ${item.productId} (+${item.quantity})`,
          );
        }

        await this.prisma.checkoutSession.update({
          where: { id: session.id },
          data: { isCancelled: true },
        });

        this.logger.log(`Session ${session.id} marked as cancelled`);
      } catch (error) {
        this.logger.error(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `Error processing rollback for session ${session.id}: ${error.message}`,
        );
      }
    }
  }
}
