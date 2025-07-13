import { BadRequestException, Injectable } from '@nestjs/common';
import { ICheckoutSession } from '../checkout-session/interfaces/checkout-session.interface';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import * as regionsJson from '../../json/region.json';
import { ObjectId } from 'mongodb';

type District = {
  value: string;
  label: string;
  province_code: string;
};

type Province = {
  province_code: string;
  label: string;
  short_name: string;
  value: string;
  place_type: string;
  children: District[];
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryService: InventoryService,
  ) {}
  async create(
    checkoutSession: ICheckoutSession,
    transactionStatus: 'PENDING' | 'SUCCESS' | 'FAILED',
  ) {
    const { products, userId } = checkoutSession;

    const order = await this.findBySessionId(checkoutSession.id);
    if (order) return;

    let refund = false;
    const errors: string[] = [];

    for (const product of products) {
      // Get inventory by productId
      const inventory = await this.inventoryService.getByProductId(
        product.productId,
      );

      if (!inventory || inventory.quantity < product.quantity) {
        refund = true;
        const errorMsg = `Product ${product.model} does not have enough stock. Available: ${inventory?.quantity || 0}`;
        errors.push(errorMsg);
        break;
      }
    }

    // console.log('Creating order:', checkoutSession);

    const provinceCode = checkoutSession.shippingInfo!.address[0];
    const districtCode = checkoutSession.shippingInfo!.address[1];
    // console.log({ provinceCode, districtCode });
    const regions: Province[] = regionsJson as Province[];

    const province = regions.find((region) => region.value === provinceCode);

    const district = province?.children.find(
      (child) => child.value === districtCode,
    );

    let locationStr = '';

    let isPaid: boolean = true;

    if (!province) {
      console.log(`Province with code ${provinceCode} not found.`);
    } else if (!district) {
      console.log(
        `District with code ${districtCode} not found in province ${province.label}.`,
      );
    } else {
      locationStr = `${province.label} / ${district.label}`;
      // console.log(locationStr);
    }

    const statusData: {
      paymentStatus?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
      orderStatus?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
    } = {};

    if (transactionStatus === 'SUCCESS') {
      if (refund) {
        console.log('Refund is required due to insufficient stock.');
        // Handle refund logic here
        statusData.paymentStatus = 'REFUNDED';
        statusData.orderStatus = 'CANCELLED';
      } else {
        console.log('Proceeding to create the order.');
        // Handle order creation logic here
        statusData.paymentStatus = 'SUCCESS';
        statusData.orderStatus = 'PROCESSING';
      }
    } else if (transactionStatus === 'PENDING') {
      statusData.paymentStatus = 'PENDING';
      statusData.orderStatus = 'PENDING';
      isPaid = false;
    } else {
      statusData.paymentStatus = 'FAILED';
      statusData.orderStatus = 'CANCELLED';
      isPaid = false;
    }

    const orders = await this.prisma.$transaction([
      this.prisma.orders.create({
        data: {
          products,
          userId,
          sessionId: checkoutSession.id,
          shippingInfo: {
            set: {
              delivery: checkoutSession.shippingInfo?.delivery || '',
              fullName: checkoutSession.shippingInfo?.fullName || '',
              phone: checkoutSession.shippingInfo?.phone || '',
              shippingfee: checkoutSession.shippingInfo?.shippingfee || 0,
              note: checkoutSession.shippingInfo?.note || '',
              address: locationStr,
            },
          },
          totalAmount:
            checkoutSession.totalAmount +
            (checkoutSession.shippingInfo?.shippingfee || 0),
          ...statusData,
        },
      }),

      this.prisma.checkoutSession.update({
        where: { id: checkoutSession.id },
        data: { isPaid: isPaid },
      }),
    ]);

    console.log('Errors:', errors);
    if (errors.length > 0) throw new BadRequestException(errors[0]);
    return orders;
  }

  findBySessionId(sessionId: string) {
    return this.prisma.orders.findFirst({
      where: { sessionId },
    });
  }

  findOne(id: string) {
    if (!id || !ObjectId.isValid(id)) return null;
    return this.prisma.orders.findUnique({ where: { id } });
  }
}
