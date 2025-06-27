import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class BrandService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}
  create(createBrandDto: CreateBrandDto) {
    return this.prisma.laptopBrand.create({
      data: { name: createBrandDto.name },
    });
  }

  findAll() {
    return this.prisma.laptopBrand.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} brand`;
  }

  async findByName(name: string) {
    const getBrandNameQuery = `laptop_brand-${name}`;
    const data: string | null = await this.redis.get(getBrandNameQuery);
    if (data) return JSON.parse(data) as { id: string; name: string };
    const newData = await this.prisma.laptopBrand.findFirst({
      where: { name },
    });
    if (!newData) return null;

    const setBrandNameQuery = `laptop_brand-${name}`;
    await this.redis.set(setBrandNameQuery, JSON.stringify(newData), 4 * 60);
    return newData;
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }

  async transSaveLaptopBrand(tx: Prisma.TransactionClient, name: string) {
    const existing = await this.findByName(name);
    if (existing) return existing.id;

    const created = await tx.laptopBrand.create({ data: { name } });
    return created.id;
  }
}
