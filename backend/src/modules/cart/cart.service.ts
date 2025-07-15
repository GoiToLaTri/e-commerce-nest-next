import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async findCartByUserId(userId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: { select: { model: true, thumbnail: true } },
          },
        },
        _count: true,
      },
    });
    return cart;
  }

  async findOneCartItem(id: string) {
    if (!id || !ObjectId.isValid(id)) return null;
    const cart = await this.prisma.cartItem.findFirst({
      where: { id },
      include: {
        product: { select: { model: true, thumbnail: true } },
      },
    });
    return cart;
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    const { productId, quantity } = dto;

    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
    });
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Product not found.');
    if (!inventory) throw new NotFoundException('Inventory not found.');

    if (quantity > Number(inventory.quantity)) {
      throw new BadRequestException(
        `Only ${inventory.quantity} items left in stock.`,
      );
    }

    let cart = await this.prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) cart = await this.prisma.cart.create({ data: { userId } });

    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > 4)
        throw new BadRequestException('Total quantity must not exceed 4.');

      if (newQuantity > Number(inventory.quantity))
        throw new BadRequestException(
          `Only ${inventory.quantity} items left in stock.`,
        );

      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          priceAtAdded: product.price,
        },
      });
    }
  }

  async updateQuantity(
    userId: string,
    cartItemId: string,
    dto: UpdateQuantityDto,
  ) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true, product: true },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found.');
    }

    if (cartItem.cart.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to edit this product.',
      );
    }
    console.log(cartItem.productId);
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId: cartItem.productId },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found.');
    }

    console.log('inventory');

    if (dto.quantity > Number(inventory.quantity)) {
      throw new BadRequestException(
        `Only ${inventory.quantity} items left in stock.`,
      );
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity: dto.quantity,
      },
    });
  }

  async deleteCartItem(userId: string, cartItemId: string) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found.');

    if (cartItem.cart.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this product.',
      );
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return { message: 'Product removed from cart successfully.' };
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart)
      // Nếu chưa có cart thì coi như xong
      return { message: 'Cart is empty.' };

    // Xóa toàn bộ cart items
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { message: 'All cart items have been removed.' };
  }
}
