import { BadRequestException, Injectable } from '@nestjs/common';
import { ICheckoutSession } from '../checkout-session/interfaces/checkout-session.interface';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import * as regionsJson from '../../json/region.json';
import { ObjectId } from 'mongodb';
import { StockExportService } from '../stock-export/stock-export.service';

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
    private readonly stockExportService: StockExportService,
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

    if (
      orders[0].paymentStatus === 'SUCCESS' &&
      orders[0].orderStatus === 'PROCESSING'
    ) {
      await Promise.all(
        orders[0].products.map((product) => {
          const stockExportDto = {
            product: product.model,
            productId: product.productId,
            quantity: product.quantity,
            reason: 'ORDER_COMPLETED',
            note: `Xuất kho cho đơn hàng: ${orders[0].id}`,
          };
          return this.stockExportService.create(stockExportDto);
        }),
      );

      console.log('Stock export successful.');
    } else {
      console.log(
        'Stock export not performed because the order conditions were not met.',
      );
    }

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

  async findAll(
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
    paymentStatus?: string[],
    orderStatus?: string[],
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    if (search && search.trim()) {
      const { data: searchData, total: searchTotal } = await this.atlasSearch(
        search,
        page,
        limit,
        sortField,
        sortOrder,
        paymentStatus,
        orderStatus,
      );

      return {
        data: searchData,
        total: searchTotal,
        page,
        limit,
      };
    }

    const where: any = {};

    const orderBy =
      sortField && sortOrder
        ? { [sortField]: sortOrder as 'asc' | 'desc' }
        : undefined;

    if (paymentStatus && paymentStatus.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.paymentStatus = {
        in: paymentStatus.map((st) => st.toUpperCase()),
      };
    }

    if (orderStatus && orderStatus.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.orderStatus = {
        in: orderStatus.map((st) => st.toUpperCase()),
      };
    }

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.orders.findMany({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        where,
        skip,
        orderBy,
        take: limit,
      }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.prisma.orders.count({ where }),
    ]);

    return {
      data: orders,
      total,
      page,
      limit,
    };
  }

  async findByClientId(
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
    userId: string,
    paymentStatus?: string[],
    orderStatus?: string[],
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    if (search && search.trim()) {
      const { data: searchData, total: searchTotal } =
        await this.clientAtlasSearch(
          search,
          page,
          limit,
          sortField,
          sortOrder,
          userId,
          paymentStatus,
          orderStatus,
        );

      return {
        data: searchData,
        total: searchTotal,
        page,
        limit,
      };
    }

    const where: any = {
      userId,
    };

    const orderBy =
      sortField && sortOrder
        ? { [sortField]: sortOrder as 'asc' | 'desc' }
        : undefined;

    if (paymentStatus && paymentStatus.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.paymentStatus = {
        in: paymentStatus.map((st) => st.toUpperCase()),
      };
    }

    if (orderStatus && orderStatus.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.orderStatus = {
        in: orderStatus.map((st) => st.toUpperCase()),
      };
    }

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.orders.findMany({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        where,
        skip,
        orderBy,
        take: limit,
      }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.prisma.orders.count({ where }),
    ]);

    return {
      data: orders,
      total,
      page,
      limit,
    };
  }

  updateStatus(
    id: string,
    orderStatus?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED',
  ) {
    if (!orderStatus) return;
    return this.prisma.orders.update({
      where: { id },
      data: { orderStatus },
    });
  }

  async clientPurchased(userId: string, page: number = 1, limit: number = 4) {
    const pipeline = [
      {
        $match: {
          // Chuyển userId trong DB sang string để so sánh với userId (string) từ input
          $expr: { $eq: [{ $toString: '$userId' }, userId] },
          paymentStatus: { $in: ['SUCCESS'] },
        },
      },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.productId',
          model: { $first: '$products.model' },
          thumbnail: { $first: '$products.thumbnail' },
          price: { $first: '$products.price' },
          shippingInfo: { $first: '$shippingInfo' },
        },
      },
      {
        // sort A-Z (ascending). Dùng -1 nếu muốn Z-A.
        $sort: { model: 1 },
      },
      {
        $facet: {
          data: [
            {
              $project: {
                _id: 0,
                id: { $toString: '$_id' },
                // productId: 1,
                model: 1,
                thumbnail: 1,
                price: 1,
                shippingInfo: 1,
              },
            },
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
          total: [{ $count: 'total' }],
        },
      },
    ];

    // Correct way to use $runCommandRaw for an aggregation pipeline
    const result = (await this.prisma.$runCommandRaw({
      aggregate: 'Orders', // <--- REPLACE WITH YOUR ACTUAL COLLECTION NAME
      pipeline: pipeline,
      cursor: {}, // Required for aggregation commands
    })) as {
      cursor: {
        firstBatch: {
          data: {
            model: string;
            thumbnail: string;
            price: number;
            productId: string;
          }[];
          total: { total: number }[];
        }[];
      };
    };
    console.log(result.cursor.firstBatch[0].data);

    return {
      data: result.cursor.firstBatch[0].data,
      total: result.cursor.firstBatch[0]?.total[0]?.total || 0,
      page,
      limit,
    };
    // const data = first.data;
    // const total = first.total[0]?.total || 0;

    // return { data, total, page, limit };
  }

  private async atlasSearch(
    search: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
    paymentStatus?: string[],
    orderStatus?: string[],
  ) {
    // console.log(search);
    const pipeline: Record<string, any>[] = [
      {
        $search: {
          index: 'order-search',
          text: {
            query: search,
            path: ['shippingInfo.fullName', 'shippingInfo.address'],
            fuzzy: {
              maxEdits: 2,
              prefixLength: 0,
              // maxExpansions: 50,
            },
          },
        },
      },
    ];

    pipeline.push({
      $addFields: {
        id: { $toString: '$_id' },
        sessionId: { $toString: 'sessionId' },
        userId: { $toString: 'userId' },
        createdAt: { $dateToString: { date: '$createdAt' } },
        updatedAt: { $dateToString: { date: '$updatedAt' } },
      },
    });

    // Lọc

    if (paymentStatus && paymentStatus.length > 0) {
      pipeline.push({
        $match: {
          'Orders.paymentStatus': {
            $in: paymentStatus.map((st) => st.toUpperCase()),
          },
        },
      });
    }

    if (orderStatus && orderStatus.length > 0) {
      pipeline.push({
        $match: {
          'Orders.orderStatus': {
            $in: orderStatus.map((st) => st.toUpperCase()),
          },
        },
      });
    }

    // Thêm sắp xếp
    const defaultSortField = 'createdAt'; // Hoặc field mặc định khác
    const validSortFields = ['createdAt', 'updatedAt']; // Danh sách các field hợp lệ

    // Validate sortField
    const safeSortField =
      sortField && validSortFields.includes(sortField)
        ? sortField
        : defaultSortField;
    const safeSortOrder = sortOrder === 'desc' ? -1 : 1;
    const sortStage = { $sort: { [safeSortField]: safeSortOrder } };
    pipeline.push(sortStage);

    // Thêm phân trang
    // Validate pagination parameters
    const safePage = Math.max(1, page || 1);
    const safeLimit = Math.max(1, Math.min(100, limit || 10)); // Giới hạn tối đa 100

    // Thêm phân trang
    pipeline.push({ $skip: (safePage - 1) * safeLimit }, { $limit: safeLimit });
    const data = await this.prisma.orders.aggregateRaw({ pipeline });
    const totalPipeline = [
      ...pipeline.filter((stage) => !('$skip' in stage || '$limit' in stage)),
    ];
    totalPipeline.push({ $count: 'total' });
    const totalResult = await this.prisma.orders.aggregateRaw({
      pipeline: totalPipeline,
    });
    let total = 0;
    if (
      Array.isArray(totalResult) &&
      totalResult.length > 0 &&
      typeof totalResult[0] === 'object' &&
      totalResult[0] !== null &&
      'total' in totalResult[0]
    ) {
      total = Number((totalResult[0] as { total: number }).total) || 0;
    }
    // Cuối cùng gọi aggregateRaw
    console.log(data);
    return { data, total, page, limit };
  }

  private async clientAtlasSearch(
    search: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
    userId: string,
    paymentStatus?: string[],
    orderStatus?: string[],
  ) {
    console.log(search);
    console.log(userId);
    const pipeline: Record<string, any>[] = [
      {
        $search: {
          index: 'order-search',
          text: {
            query: search,
            path: ['shippingInfo.fullName', 'shippingInfo.address'],
            fuzzy: {
              maxEdits: 2,
              prefixLength: 0,
              // maxExpansions: 50,
            },
          },
        },
      },
    ];

    pipeline.push({
      $addFields: {
        id: { $toString: '$_id' },
        sessionId: { $toString: 'sessionId' },
        userId: { $toString: 'userId' },
        createdAt: { $dateToString: { date: '$createdAt' } },
        updatedAt: { $dateToString: { date: '$updatedAt' } },
      },
    });

    pipeline.push({
      $match: {
        userId: { $eq: { $oid: userId } },
      },
    });

    // Lọc

    if (paymentStatus && paymentStatus.length > 0) {
      pipeline.push({
        $match: {
          'Orders.paymentStatus': {
            $in: paymentStatus.map((st) => st.toUpperCase()),
          },
        },
      });
    }

    if (orderStatus && orderStatus.length > 0) {
      pipeline.push({
        $match: {
          'Orders.orderStatus': {
            $in: orderStatus.map((st) => st.toUpperCase()),
          },
        },
      });
    }

    // Thêm sắp xếp
    const defaultSortField = 'createdAt'; // Hoặc field mặc định khác
    const validSortFields = ['createdAt', 'updatedAt']; // Danh sách các field hợp lệ

    // Validate sortField
    const safeSortField =
      sortField && validSortFields.includes(sortField)
        ? sortField
        : defaultSortField;
    const safeSortOrder = sortOrder === 'desc' ? -1 : 1;
    const sortStage = { $sort: { [safeSortField]: safeSortOrder } };
    pipeline.push(sortStage);

    // Thêm phân trang
    // Validate pagination parameters
    const safePage = Math.max(1, page || 1);
    const safeLimit = Math.max(1, Math.min(100, limit || 10)); // Giới hạn tối đa 100

    // Thêm phân trang
    pipeline.push({ $skip: (safePage - 1) * safeLimit }, { $limit: safeLimit });
    const data = await this.prisma.orders.aggregateRaw({ pipeline });
    const totalPipeline = [
      ...pipeline.filter((stage) => !('$skip' in stage || '$limit' in stage)),
    ];
    totalPipeline.push({ $count: 'total' });
    const totalResult = await this.prisma.orders.aggregateRaw({
      pipeline: totalPipeline,
    });
    let total = 0;
    if (
      Array.isArray(totalResult) &&
      totalResult.length > 0 &&
      typeof totalResult[0] === 'object' &&
      totalResult[0] !== null &&
      'total' in totalResult[0]
    ) {
      total = Number((totalResult[0] as { total: number }).total) || 0;
    }
    // Cuối cùng gọi aggregateRaw
    console.log(data);
    return { data, total, page, limit };
  }
}
