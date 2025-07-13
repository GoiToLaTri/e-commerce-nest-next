import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './common/configs';
// import { ChatModule } from './modules/chat/chat.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SessionModule } from './modules/session/session.module';
import { RedisModule } from './modules/redis/redis.module';
import { RoleModule } from './modules/role/role.module';
import { SharedModule } from './shared/shared.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { ProductModule } from './modules/product/product.module';
import { BrandModule } from './modules/brand/brand.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { StockImportModule } from './modules/stock-import/stock-import.module';
import { StockExportModule } from './modules/stock-export/stock-export.module';

import { InventoryLogModule } from './modules/inventory-log/inventory-log.module';
import { StockHistoryModule } from './modules/stock-history/stock-history.module';
import { StockAdjustmentModule } from './modules/stock-adjustment/stock-adjustment.module';
import { UserInteractionModule } from './modules/user-interaction/user-interaction.module';
import { ProductSpecificationModule } from './modules/product-specification/product-specification.module';
import { SearchModule } from './modules/search/search.module';
import { CartModule } from './modules/cart/cart.module';
import { RecommendationModule } from './modules/recommendation/recommendation.module';
import { CheckoutSessionModule } from './modules/checkout-session/checkout-session.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { PaymentModule } from './modules/payment/payment.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    // ChatModule,
    PrismaModule,
    UserModule,
    AuthModule,
    SessionModule,
    RedisModule,
    RoleModule,
    SharedModule,
    CloudinaryModule,
    ProductModule,
    BrandModule,
    InventoryModule,
    StockImportModule,
    StockExportModule,
    InventoryLogModule,
    StockAdjustmentModule,
    StockHistoryModule,
    UserInteractionModule,
    ProductSpecificationModule,
    SearchModule,
    CartModule,
    RecommendationModule,
    CheckoutSessionModule,
    CheckoutModule,
    PaymentModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfig],
})
export class AppModule {}
