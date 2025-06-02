import { Module } from '@nestjs/common';
import { MongoFileStorageService } from './services/mongo-file-storage.service';
import { MulterConfigService } from './services/multer-config.service';
import { MulterModule } from '@nestjs/platform-express';
import { MongoFileStorageController } from './mongo-file-storage.controller';
import { MongoFileStorageProvider } from './provider/mongo-file-storage.provider';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [MongoFileStorageController],
  providers: [
    MulterConfigService,
    MongoFileStorageService,
    MongoFileStorageProvider,
  ],
  exports: [
    MongoFileStorageService,
    MongoFileStorageProvider
  ]

})
export class MongoFileStorageModule { }
