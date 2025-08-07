import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ICPU,
  ICPUInfo,
  IDisplay,
  IDisplayInfo,
  IGPUInfo,
  IRam,
  IRamInfo,
  IStorage,
  IStorageInfo,
} from './interfaces';
import { productUtil } from '@/common/utils';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { Prisma } from 'generated/prisma';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { BrandService } from '../brand/brand.service';
import { IProduct } from './interfaces/product.interface';
import { InventoryService } from '../inventory/inventory.service';
import { appConfig } from '@/common/configs';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly cloudinary: CloudinaryService,
    private readonly brandService: BrandService,
    private readonly inventoryService: InventoryService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    await this.redis.del('product-*');
    await this.redis.del('list:*');
    // console.log(createProductDto.display);
    const displayInput = productUtil.cleanDisplayInput(
      createProductDto.display,
    );

    const images = createProductDto.imageList.flatMap((image) => image.images);
    const cpu: ICPUInfo | null = productUtil.parseCpuName(createProductDto.cpu);
    const gpu: IGPUInfo | null = productUtil.parseGPUName(createProductDto.gpu);
    const display: IDisplayInfo | null =
      productUtil.parseDisplayInfo(displayInput);
    const ram: IRamInfo | null = productUtil.parseRamInfo(createProductDto.ram);
    const storage: IStorageInfo | null = productUtil.parseStorageInfo(
      createProductDto.storage,
    );

    // console.log('Images', images);
    // console.log('CPU', cpu);
    // console.log('GPU', gpu);
    // console.log('Display', display);
    // console.log('Ram', ram);
    // console.log('Storage', storage);

    if (!cpu) throw new BadRequestException('CPU info invalid');
    if (!gpu) throw new BadRequestException('GPU info invalid');
    if (!display) throw new BadRequestException('Display info invalid');
    if (!ram) throw new BadRequestException('Ram info invalid');
    if (!storage) throw new BadRequestException('Storage info invalid');

    return this.prisma.$transaction(
      async (tx) => {
        const brandId = await this.brandService.transSaveLaptopBrand(
          tx,
          createProductDto.brand,
        );
        const cpuId = await this.transSaveCpu(tx, cpu);
        const gpuId = await this.transSaveGpu(tx, gpu);
        const displayId = await this.transSaveDisplay(tx, display);
        const ramId = await this.transSaveRam(tx, ram);
        const storageId = await this.transSaveStorage(tx, storage);

        // console.log(createProductDto.thumbnail);

        const product = await tx.product.create({
          data: {
            model: createProductDto.model,
            description: createProductDto.description,
            thumbnail: createProductDto.thumbnail[0].url,
            price: createProductDto.pricing,
            LaptopBrand: { connect: { id: brandId } },
            Processor: { connect: { id: cpuId } },
            VideoGraphics: { connect: { id: gpuId } },
            Display: { connect: { id: displayId } },
            Memory: { connect: { id: ramId } },
            Storage: { connect: { id: storageId } },
            Admin: { connect: { id: '685b493087f9c8207f8a54da' } },
          },
        });

        await this.inventoryService.transCreate(tx, product.id);

        await this.cloudinary.findByPublicIdAndUpdate(
          createProductDto.thumbnail[0].public_id,
          { is_temp: false, productId: product.id },
        );

        for (const image of images)
          await this.cloudinary.findByPublicIdAndUpdate(image.public_id, {
            is_temp: false,
            productId: product.id,
          });
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 24000, // default: 5000
      },
    );
  }

  async findAll(
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
    laptopBrand?: string[],
    saleStatus?: string[],
    search?: string,
  ) {
    // const cacheKey = `list:page-${page}:limit-${limit}:${sortField || 'field-default'}:${sortOrder || 'order-default'}:${laptopBrand?.join(',') || 'brand-all'}:${saleStatus?.join(',') || 'status-all'}:${search || ''}`;
    // const data: string | null = await this.redis.get(cacheKey);
    // if (data) return JSON.parse(data) as IProduct[];

    const skip = (page - 1) * limit;
    if (search && search.trim()) {
      const { data: searchData, total: searchTotal } = await this.atlasSearch(
        search,
        page,
        limit,
        sortField,
        sortOrder,
        laptopBrand,
        saleStatus,
      );

      // await this.redis.set(
      //   cacheKey,
      //   JSON.stringify({ data: searchData, total: searchTotal, page, limit }),
      //   appConfig.REDIS_TTL_CACHE,
      // );
      return {
        data: searchData,
        total: searchTotal,
        page,
        limit,
      };
    }

    const where: any = {};

    if (saleStatus && saleStatus.length > 0) {
      const bools = saleStatus.map((st) => st === 'true');
      const uniqueBools = [...new Set(bools)];

      if (uniqueBools.length === 1) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        where.status = uniqueBools[0];
      }
      // nếu có cả true lẫn false thì không cần filter vì lấy hết
    }

    const orderBy =
      sortField && sortOrder
        ? { [sortField]: sortOrder as 'asc' | 'desc' }
        : undefined;

    if (laptopBrand && laptopBrand.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.LaptopBrand = {
        name: {
          in: laptopBrand,
          mode: 'insensitive', // không phân biệt hoa thường
        },
      };
    }

    const [listProduct, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        where,
        skip,
        orderBy,
        take: limit,
        select: {
          id: true,
          model: true,
          thumbnail: true,
          created_at: true,
          updated_at: true,
          status: true,
          LaptopBrand: { select: { name: true } },
        },
      }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.prisma.product.count({ where }),
    ]);

    // await this.redis.set(
    //   cacheKey,
    //   JSON.stringify({
    //     data: listProduct,
    //     total,
    //     page,
    //     limit,
    //   }),
    //   appConfig.REDIS_TTL_CACHE,
    // );

    return {
      data: listProduct,
      total,
      page,
      limit,
    };
  }

  async findAllCustomer(
    page: number,
    limit: number,
    laptopBrand: string[] = [],
    cpuBrand: string[] = [],
    cpuSeries: string[] = [],
  ) {
    const clientProductKey = `list:client:product:page-${page}:limit-${limit}:laptopBrand-${laptopBrand.join(',') || 'all'}:cpuBrand-${cpuBrand.join(',') || 'all'}:cpuSeries-${cpuSeries.join(',') || 'all'}`;
    const data: string | null = await this.redis.get(clientProductKey);
    if (data) return JSON.parse(data) as IProduct[];

    const skip = (page - 1) * limit;
    const where: any = { status: true };

    // console.log({ laptopBrand, cpuBrand, cpuSeries });

    if (laptopBrand && laptopBrand.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.LaptopBrand = { name: { in: laptopBrand, mode: 'insensitive' } };
    }

    if (cpuBrand && cpuBrand.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.Processor = { brand: { in: cpuBrand, mode: 'insensitive' } };
    }

    if (cpuSeries && cpuSeries.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.Processor = { series: { in: cpuSeries, mode: 'insensitive' } };
    }

    const [listProduct, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        where,

        skip,
        // orderBy,
        take: limit,
        select: {
          id: true,
          model: true,
          thumbnail: true,
          price: true,
          created_at: true,
          updated_at: true,
          status: true,
          LaptopBrand: { select: { name: true } },
        },
      }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.prisma.product.count({ where }),
    ]);

    await this.redis.set(
      clientProductKey,
      JSON.stringify({
        data: listProduct,
        total,
        page,
        limit,
      }),
      appConfig.REDIS_TTL_CACHE,
    );

    return {
      data: listProduct,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    if (!ObjectId.isValid(id)) return null;

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        LaptopBrand: true,
        Processor: true,
        VideoGraphics: true,
        Display: true,
        Memory: true,
        Storage: true,
        images: true,
      },
    });

    if (!product) return null;

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
      include: {
        images: true,
      },
    });
  }

  async findCpuByModel(model: string) {
    const cacheKey = `cpu-${model.replaceAll(' ', '_')}`;
    const data: string | null = await this.redis.get(cacheKey);
    if (data) return JSON.parse(data) as ICPU;

    const newData = await this.prisma.processor.findFirst({
      where: { model },
    });
    if (!newData) return null;

    await this.redis.set(cacheKey, JSON.stringify(newData), 4 * 60);
    return newData;
  }

  async findGpuByName(name: string) {
    // console.log('Finding GPU by name:', name);
    const cacheKey = `gpu-${name.replaceAll(' ', '_')}`;
    const data: string | null = await this.redis.get(cacheKey);
    if (data) return JSON.parse(data) as ICPU;

    const newData = await this.prisma.videoGraphics.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });
    if (!newData) return null;

    await this.redis.set(cacheKey, JSON.stringify(newData), 4 * 60);
    return newData;
  }

  async findDisplayByInfo(info: string) {
    const cacheKey = `display-${info.replaceAll(' ', '_')}`;
    const data: string | null = await this.redis.get(cacheKey);
    if (data) return JSON.parse(data) as IDisplay;

    const newData = await this.prisma.display.findFirst({
      where: { info },
    });
    if (!newData) return null;

    await this.redis.set(cacheKey, JSON.stringify(newData), 4 * 60);
    return newData;
  }

  async findRamByInfo(info: string) {
    const cacheKey = `ram-${info.replaceAll(' ', '_')}`;
    const data: string | null = await this.redis.get(cacheKey);
    if (data) return JSON.parse(data) as IRam;

    const newData = await this.prisma.memory.findUnique({
      where: { info },
    });
    if (!newData) return null;

    await this.redis.set(cacheKey, JSON.stringify(newData), 4 * 60);
    return newData;
  }

  async findStorageByInfo(info: string) {
    const cacheKey = `storage-${info.replaceAll(' ', '_')}`;
    const data: string | null = await this.redis.get(cacheKey);
    if (data) return JSON.parse(data) as IStorage;

    const newData = await this.prisma.storage.findFirst({
      where: { info },
    });
    if (!newData) return null;

    await this.redis.set(cacheKey, JSON.stringify(newData), 4 * 60);
    return newData;
  }

  async transSaveCpu(tx: Prisma.TransactionClient, cpu: ICPUInfo) {
    const existing = await this.findCpuByModel(cpu.model);
    if (existing) return existing.id;

    const created = await tx.processor.create({
      data: {
        brand: cpu.brand,
        family: cpu.family,
        generation: cpu.generation,
        model: cpu.model,
        series: cpu.series,
        sku: cpu.sku,
        suffix: cpu.suffix || '-',
      },
    });

    return created.id;
  }

  async transSaveGpu(tx: Prisma.TransactionClient, gpu: IGPUInfo) {
    // console.log('GPU modal', gpu);
    const existing = await this.findGpuByName(gpu.name);
    if (existing) return existing.id;
    // console.log('existing gpu', existing);
    const created = await tx.videoGraphics.create({
      data: {
        manufacturer: gpu.manufacturer,
        brand: gpu.brand,
        memory_type: gpu.memory_type || '-',
        prefix: gpu.prefix,
        vram_gb: gpu.vram_gb || 0,
        model: gpu.model,
        series: gpu.series,
        name: gpu.name,
      },
    });

    return created.id;
  }

  async transSaveDisplay(tx: Prisma.TransactionClient, display: IDisplayInfo) {
    const existing = await this.findDisplayByInfo(display.info);
    if (existing) return existing.id;

    const created = await tx.display.create({
      data: {
        info: display.info,
        size: display.size,
        resolution: display.resolution,
        refresh_rate: display.refresh_rate,
        panel_type: display.panel_type,
        brightness: display.brightness,
        color_coverage: display.color_coverage,
        ratio: display.ratio,
        response_time: display.response_time || '-',
      },
    });

    return created.id;
  }

  async transSaveRam(tx: Prisma.TransactionClient, ram: IRamInfo) {
    const existing = await this.findRamByInfo(ram.info);
    if (existing) return existing.id;

    const created = await tx.memory.create({
      data: {
        info: ram.info,
        type: ram.type,
        speed: ram.speed,
        capacity: ram.capacity,
        max_capacity: ram.max_capacity,
        slots: ram.slots || 1,
        sticks: ram.sticks,
      },
    });

    return created.id;
  }

  async transSaveStorage(tx: Prisma.TransactionClient, storage: IStorageInfo) {
    const existing = await this.findStorageByInfo(storage.info);
    if (existing) return existing.id;

    const created = await tx.storage.create({
      data: {
        info: storage.info,
        type: storage.type,
        capacity: storage.capacity,
        interface: storage.interface,
        max_capacity: storage.max_capacity || '-',
        slots: storage.slots || 1,
      },
    });

    return created.id;
  }

  private async atlasSearch(
    search: string,
    page: number,
    limit: number,
    sortField: string,
    sortOrder: string,
    laptopBrand?: string[],
    saleStatus?: string[],
  ) {
    // console.log(search);
    const pipeline: Record<string, any>[] = [
      {
        $search: {
          index: 'product_search',
          text: {
            query: search,
            path: 'model',
            fuzzy: {
              maxEdits: 2,
              prefixLength: 1,
            },
          },
        },
      },
    ];

    // Thêm lọc changeType nếu có
    if (laptopBrand && laptopBrand.length > 0) {
      pipeline.push({
        $match: { 'Product.LaptopBrand.name': { $in: laptopBrand } },
      });
    }

    // Thêm lọc saleStatus nếu có
    if (saleStatus && saleStatus.length > 0) {
      const bools = saleStatus.map((st) => st === 'true');
      const uniqueBools = [...new Set(bools)];
      if (uniqueBools.length === 1) {
        pipeline.push({
          $match: { 'Product.status': uniqueBools[0] },
        });
      }
    }

    // Thêm addFields cho id + reference + product
    pipeline.push(
      {
        $addFields: {
          id: { $toString: '$_id' },
          created_at: { $dateToString: { date: '$created_at' } },
          updated_at: { $dateToString: { date: '$updated_at' } },
        },
      },
      {
        $lookup: {
          from: 'LaptopBrand', // tên collection
          localField: 'brand_id', // trường bên Product
          foreignField: '_id', // field bên LaptopBrand
          as: 'LaptopBrand',
        },
      },
      // lấy object thay vì array
      {
        $unwind: {
          path: '$LaptopBrand',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unset: [
          '_id',
          'brand_id',
          'description',
          'price',
          'processor_id',
          'videographics_id',
          'display_id',
          'memory_id',
          'storage_id',
          'adminId',
          'LaptopBrand.created_at',
          'LaptopBrand.updated_at',
          'LaptopBrand._id',
        ],
      },
    );

    // Thêm sắp xếp
    const defaultSortField = 'created_at'; // Hoặc field mặc định khác
    const validSortFields = ['created_at', 'updated_at']; // Danh sách các field hợp lệ

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
    const data = await this.prisma.product.aggregateRaw({ pipeline });
    const totalPipeline = [
      ...pipeline.filter((stage) => !('$skip' in stage || '$limit' in stage)),
    ];
    totalPipeline.push({ $count: 'total' });
    const totalResult = await this.prisma.product.aggregateRaw({
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

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
