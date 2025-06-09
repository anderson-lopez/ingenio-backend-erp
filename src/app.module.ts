import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { SaleModule } from './modules/sale/sale.module';
import { MongoFileStorageModule } from './modules/mongo-file-storage/mongo-file-storage.module';
import { BitacoraLogsModule } from './modules/bitacora-logs/bitacora-logs.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { DteModule } from './modules/dte/dte.module';
import { ContabilidadModule } from './modules/contabilidad/contabilidad.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        databaseConfig(configService),
    }),
    BitacoraLogsModule,
    MongoFileStorageModule,
    AuthenticationModule,
    PurchaseModule,
    DteModule,
    SaleModule,
    ContabilidadModule,
    InventoryModule    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
