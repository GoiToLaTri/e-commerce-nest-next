import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createReviewDto: CreateReviewDto) {
    const {
      productId,
      userId,
      rating,
      content,
      title,
      productName,
      customerName,
    } = createReviewDto;
    // console.log(createReviewDto);
    if (!productId || !userId || !rating)
      throw new BadRequestException('Missing required information.');

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new BadRequestException('Product not found.');

    const review = await this.prisma.review.create({
      data: {
        content,
        customerName,
        productName,
        rating,
        title,
        productId,
        userId,
        status: 'APPROVED',
      },
    });

    return review;
  }

  findAll() {
    return `This action returns all review`;
  }

  findByProductId(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
