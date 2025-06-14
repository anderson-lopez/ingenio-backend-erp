import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './services/sale.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  Product,
  Category,
  SubCategory,
  Brand,
  TypeProduct,
  UnitMeasure,
  ProductImages,
  Client,
  ClientCategory,
  Gender,
  MaritalStatus,
  ClientDocumentType,
  ClientPoint,
  PaymentMethod,
  SaleDocumentType,
  Sale,
  SaleDetail,
  SaleStatus,
  Order,
  OrderDetail,
  DiscountApproval,
} from './entities/index';
import { ProductInventory } from '../inventory/entities/index';
import { User } from '../authentication/entities/user.entity';
import { InventoryHelperProvider } from '../inventory/providers/InventoryHelperProvider.provider';
import { SaleProvider } from './providers/sale.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      SubCategory,
      Brand,
      TypeProduct,
      UnitMeasure,
      ProductImages,
      Client,
      ClientCategory,
      Gender,
      MaritalStatus,
      ClientDocumentType,
      ClientPoint,
      PaymentMethod,
      SaleDocumentType,
      Sale,
      SaleDetail,
      SaleStatus,
      Order,
      OrderDetail,
      User,
      DiscountApproval,
      ProductInventory,
    ]),
  ],
  controllers: [SaleController],
  providers: [SaleService, InventoryHelperProvider, SaleProvider],
})
export class SaleModule {}
