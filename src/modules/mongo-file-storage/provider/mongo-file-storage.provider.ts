import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import { Connection } from 'mongoose';
import { Db } from 'mongodb';
import { GridFSBucket } from 'mongodb';
require('dotenv').config();

@Injectable()
export class MongoFileStorageProvider {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  getBucket(bucketName: string): MongoGridFS {
    const mongoClient = this.connection.getClient();
    const db = mongoClient.db(this.connection.db.databaseName);
    return new MongoGridFS(db as unknown as Db, bucketName);
  }

  getGridFSBucket(bucketName: string): GridFSBucket {
    console.log('bucketName:', bucketName);
    const mongoClient = this.connection.getClient();
    const db = mongoClient.db(this.connection.db.databaseName);
    return new GridFSBucket(db as unknown as Db, { bucketName });
  }
}
