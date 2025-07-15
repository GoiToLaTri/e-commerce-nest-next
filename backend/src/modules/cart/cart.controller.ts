import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { SessionData } from '../session/interfaces';
import { UpdateQuantityDto } from './dto/update-quantity.dto';

@Controller('cart')
@UseGuards(JwtGuard, RoleGuard)
@Roles(Role.USER)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('client')
  getCart(@Req() request: Request) {
    const { session_user } = request as unknown as {
      session_user: SessionData;
    };
    return this.cartService.findCartByUserId(session_user.user_id);
  }

  @Get('client/:cartItemId')
  getCartItems(@Param('cartItemId') id: string) {
    // const { session_user } = request as unknown as {
    //   session_user: SessionData;
    // };
    return this.cartService.findOneCartItem(id);
  }

  @Post('add')
  addToCart(@Req() request: Request, @Body() dto: AddToCartDto) {
    const { session_user } = request as unknown as {
      session_user: SessionData;
    };
    if (!session_user || !session_user.user_id)
      throw new BadRequestException('User not found.');

    return this.cartService.addToCart(session_user.user_id, dto);
  }

  @Patch('item/:cartItemId')
  updateQuantity(
    @Req() request: Request,
    @Param('cartItemId') cartItemId: string,
    @Body() dto: UpdateQuantityDto,
  ) {
    const { session_user } = request as unknown as {
      session_user: SessionData;
    };
    return this.cartService.updateQuantity(
      session_user.user_id,
      cartItemId,
      dto,
    );
  }

  @Delete('item/:cartItemId')
  deleteCartItem(
    @Req() request: Request,
    @Param('cartItemId') cartItemId: string,
  ) {
    const { session_user } = request as unknown as {
      session_user: SessionData;
    };
    return this.cartService.deleteCartItem(session_user.user_id, cartItemId);
  }

  @Delete()
  clearCart(@Req() request: Request) {
    const { session_user } = request as unknown as {
      session_user: SessionData;
    };
    return this.cartService.clearCart(session_user.user_id);
  }
}
