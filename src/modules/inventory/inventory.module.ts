import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { GeneralController } from './general.controller';
import { InventoryService } from './services/inventory.service';
import {
  ProductInventory,
  Branch,
  Warehouse,
  WarehouseBranch,
  ProductRefill,
  LevelZone,
  ProductRepositionFrecuency,
  ProductRotation,
  RackZone,
  ProductRefillStatus,
  Department,
  Municipality,
  District,
  TypeClient,
  EconomicActivity,
} from './entities/index';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImages } from '../sale/entities/index';
import { InventoryHelperProvider } from './providers/InventoryHelperProvider.provider';
import { GeneralService } from './services/general.service';
import { MongoFileStorageModule } from '../mongo-file-storage/mongo-file-storage.module';
import { MongoFileStorageService } from '../mongo-file-storage/services/mongo-file-storage.service';
import { MongoFileStorageProvider } from '../mongo-file-storage/provider/mongo-file-storage.provider';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductInventory,
      Branch,
      Warehouse,
      WarehouseBranch,
      Product,
      ProductRefill,
      LevelZone,
      ProductRepositionFrecuency,
      ProductRotation,
      RackZone,
      ProductRefillStatus,
      ProductImages,
      Department,
      Municipality,
      District,
      TypeClient,
      EconomicActivity,
      MongoFileStorageModule,
    ]),
  ],
  controllers: [InventoryController, GeneralController],
  providers: [InventoryService, GeneralService, InventoryHelperProvider, MongoFileStorageService, MongoFileStorageProvider],
})
export class InventoryModule { }
