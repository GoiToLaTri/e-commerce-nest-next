import { Injectable } from '@nestjs/common';
import { CreateUserInteractionDto } from './dto/create-user-interaction.dto';
import { UpdateUserInteractionDto } from './dto/update-user-interaction.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { appConfig } from '@/common/configs';

@Injectable()
export class UserInteractionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(createUserInteractionDto: CreateUserInteractionDto) {
    const cacheKey = `create-user-interaction:${createUserInteractionDto.userId}:${createUserInteractionDto.productId}:${createUserInteractionDto.action}`;
    let data: CreateUserInteractionDto;
    const cache: string | null = await this.redis.get(cacheKey);
    if (cache) data = JSON.parse(cache) as CreateUserInteractionDto;
    else data = createUserInteractionDto;

    await this.redis.set(
      cacheKey,
      JSON.stringify(data),
      appConfig.REDIS_TTL_CACHE,
    );
    const interaction = await this.prisma.userInteraction.create({ data });
    return interaction;
  }

  findAll() {
    return `This action returns all userInteraction`;
  }

  /**
   * Lấy tất cả interaction của user
   */
  findByUserId(userId: string) {
    return this.prisma.userInteraction.findMany({
      where: { userId },
    });
  }

  /**
   * Lấy tất cả interaction theo action
   */
  findUserInteractionsByAction(userId: string, action: string) {
    return this.prisma.userInteraction.findMany({
      where: { userId, action },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} userInteraction`;
  }

  update(id: number, updateUserInteractionDto: UpdateUserInteractionDto) {
    return `This action updates a #${id} userInteraction`;
  }

  remove(id: number) {
    return `This action removes a #${id} userInteraction`;
  }

  /**
   * Kiểm tra user đã tương tác với sản phẩm chưa
   */
  async hasUserInteracted(userId: string, productId: string) {
    const result = await this.prisma.userInteraction.findFirst({
      where: { userId, productId },
    });
    return result !== null;
  }
}
