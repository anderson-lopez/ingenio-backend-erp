import { Injectable, Logger } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { MongoConfig } from 'src/config/mongo.gridfs.config';
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  private gridFsStorage: typeof GridFsStorage;
  bucketName = process.env.MONGO_GRIDFS_BUCKET_NAME;
  private readonly logger = new Logger(MulterConfigService.name);
  constructor() {
    // Configuración del almacenamiento en GridFS
    this.initMongoConnection();
  }

  private async initMongoConnection() {
    try {
      const db = MongoClient.connect(MongoConfig.uri).then((client) =>
        client.db(MongoConfig.dbName),
      );
      console.log('initMongoConnection:', this.bucketName);

      this.gridFsStorage = new GridFsStorage({
        db: db,
        file: (req, file) => {
          return new Promise((resolve) => {
            const filename = file.originalname.trim();
            const bucketName = req.query.bucketName || this.bucketName;
            console.log('Dynamic bucketName:', bucketName);

            const fileInfo = {
              filename: filename,
              bucketName: bucketName,
            };
            resolve(fileInfo);
          });
        },
      });
      console.log('databse:', db);
    } catch (error) {
      this.logger.error('Failed to  GridFS storage', error);
      throw new Error('Error configuring GridFS storage: ' + error.message);
    }
  }

  createMulterOptions(): MulterModuleOptions {
    console.log('createMulterOptions:', this.bucketName);
    return {
      storage: this.gridFsStorage,
    };
  }
}
