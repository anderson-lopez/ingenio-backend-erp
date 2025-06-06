import { Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './services/purchase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParseIntPipe } from '@nestjs/common';

import {
  Product,
  Supplier,
  PaymentMethod,
  Purchase,
  PurchaseDetail,
  PurchaseDocumentType,
  DiscountApproval,
} from './entities/index';
import { User } from '../authentication/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Supplier,
      PaymentMethod,
      Purchase,
      PurchaseDetail,
      PurchaseDocumentType,
      DiscountApproval,
      User,
      ParseIntPipe
    ]),
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService],
})
export class PurchaseModule {}
