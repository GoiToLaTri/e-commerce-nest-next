import { Injectable } from '@nestjs/common';
import { CreateUserInteractionDto } from './dto/create-user-interaction.dto';
import { UpdateUserInteractionDto } from './dto/update-user-interaction.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserInteractionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserInteractionDto: CreateUserInteractionDto) {
    const interaction = await this.prisma.userInteraction.create({
      data: {
        userId: createUserInteractionDto.userId,
        productId: createUserInteractionDto.productId,
        action: createUserInteractionDto.action,
      },
    });
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
