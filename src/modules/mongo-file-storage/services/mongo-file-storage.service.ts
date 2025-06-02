require('dotenv').config();
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import mongoose, { Connection } from 'mongoose';
import { GridFSBucketReadStream } from 'mongodb';
import { FileInfoVm } from '../dto/file-info-vm.model';
import { GridFSBucket } from 'mongodb';
import { MongoFileStorageProvider } from '../provider/mongo-file-storage.provider';

const bucketName = process.env.MONGO_GRIDFS_BUCKET_NAME;
console.log('bucketName:', bucketName);

@Injectable()
export class MongoFileStorageService {
  private fileModel: MongoGridFS;
  private gridFSBucket: GridFSBucket;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly mongoFileStorageProvider: MongoFileStorageProvider,
  ) {}

  async readStream(
    id: string,
    bucketName: string,
  ): Promise<GridFSBucketReadStream> {
    this.fileModel = this.mongoFileStorageProvider.getBucket(bucketName);
    return await this.fileModel.readFileStream(id);
  }

  async findInfo(id: string, bucketName: string): Promise<FileInfoVm> {
    try {
      console.log('bucketName:', bucketName);
      this.fileModel = this.mongoFileStorageProvider.getBucket(bucketName);
      const result = await this.fileModel.findById(id);

      if (!result) {
        console.log('File not found');
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      return {
        filename: result.filename,
        length: result.length,
        chunkSize: result.chunkSize,
        contentType: result.contentType,
      };
    } catch (error) {
      console.log('error', error);
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteFile(id: string, bucketName: string): Promise<void> {
    try {
      console.log('bucketName delete:', bucketName);
      this.gridFSBucket =
        this.mongoFileStorageProvider.getGridFSBucket(bucketName);
      const documentToDelete = await this.gridFSBucket
        .find({ _id: new mongoose.Types.ObjectId(id) as any })
        .toArray();
      await this.gridFSBucket.delete(documentToDelete[0]._id);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Error deleting file: ' + error.message);
    }
  }
}
