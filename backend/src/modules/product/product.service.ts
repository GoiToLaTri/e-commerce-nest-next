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

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly cloudinary: CloudinaryService,
    private readonly brandService: BrandService,
    private readonly inventoryService: InventoryService,
  ) {}
  create(createProductDto: CreateProductDto) {
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

    return this.prisma.$transaction(async (tx) => {
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
    });
  }

  async findAll(page: number) {
    const getProductQuery = `list-product-page-${page}`;
    const data: string | null = await this.redis.get(getProductQuery);
    if (data) return JSON.parse(data) as IProduct[];

    const listProduct = await this.prisma.product.findMany({
      skip: (page - 1) * 10,
      take: 10,
      include: {
        LaptopBrand: true,
        Processor: true,
        VideoGraphics: true,
        Display: true,
        Memory: true,
        Storage: true,
      },
    });

    const setProductQuery = `list-product-page-${page}`;
    await this.redis.set(
      setProductQuery,
      JSON.stringify(listProduct),
      4 * 60 * 60,
    );

    return listProduct;
  }

  async findOne(id: string) {
    const productQuery = `product-${id}`;
    const cached: string | null = await this.redis.get(productQuery);
    if (cached) return JSON.parse(cached) as IProduct;

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
    await this.redis.set(productQuery, JSON.stringify(product), 4 * 60 * 60);
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async findCpuByModel(model: string) {
    const getModelQuery = `cpu-${model.replaceAll(' ', '_')}`;
    const data: string | null = await this.redis.get(getModelQuery);
    if (data) return JSON.parse(data) as ICPU;

    const newData = await this.prisma.processor.findFirst({
      where: { model },
    });
    if (!newData) return null;

    const setModelQuery = `cpu-${newData.model.replaceAll(' ', '_')}`;
    await this.redis.set(setModelQuery, JSON.stringify(newData), 4 * 60);
    return newData;
  }

  async findGpuByModel(model: string) {
    const getModelQuery = `gpu-${model.replaceAll(' ', '_')}`;
    const data: string | null = await this.redis.get(getModelQuery);
    if (data) return JSON.parse(data) as ICPU;

    const newData = await this.prisma.videoGraphics.findFirst({
      where: { model },
    });
    if (!newData) return null;

    const setModelQuery = `gpu-${newData.model.replaceAll(' ', '_')}`;
    await this.redis.set(setModelQuery, JSON.stringify(newData), 4 * 60);
    return newData;
  }

  async findDisplayByInfo(info: string) {
    const getDisplayQuery = `display-${info.replaceAll(' ', '_')}`;
    const data: string | null = await this.redis.get(getDisplayQuery);
    if (data) return JSON.parse(data) as IDisplay;

    const newData = await this.prisma.display.findFirst({
      where: { info },
    });
    if (!newData) return null;

    const setDisplayQuery = `display-${newData.info.replaceAll(' ', '_')}`;
    await this.redis.set(setDisplayQuery, JSON.stringify(newData), 4 * 60);
    return newData;
  }

  async findRamByInfo(info: string) {
    const getRamQuery = `ram-${info.replaceAll(' ', '_')}`;
    const data: string | null = await this.redis.get(getRamQuery);
    if (data) return JSON.parse(data) as IRam;

    const newData = await this.prisma.memory.findUnique({
      where: { info },
    });
    if (!newData) return null;

    const setRamQuery = `ram-${newData.info.replaceAll(' ', '_')}`;
    await this.redis.set(setRamQuery, JSON.stringify(newData), 4 * 60);
    return newData;
  }

  async findStorageByInfo(info: string) {
    const getStorageQuery = `storage-${info.replaceAll(' ', '_')}`;
    const data: string | null = await this.redis.get(getStorageQuery);
    if (data) return JSON.parse(data) as IStorage;

    const newData = await this.prisma.storage.findFirst({
      where: { info },
    });
    if (!newData) return null;

    const setStorageQuery = `storage-${newData.info.replaceAll(' ', '_')}`;
    await this.redis.set(setStorageQuery, JSON.stringify(newData), 4 * 60);
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
    const existing = await this.findGpuByModel(gpu.model);
    if (existing) return existing.id;

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
        max_capacity: storage.max_capacity,
        slots: storage.slots,
      },
    });

    return created.id;
  }
}
