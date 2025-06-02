require('dotenv').config();
import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

const dbUser = process.env.MONGO_USERNAME || 'admin';
const dbPassword = process.env.MONGO_PASSWORD || 'admin';
const dbHost = process.env.MONGO_HOST || 'localhost';
const dbPort = process.env.MONGO_PORT || '27017';
const dbName = process.env.MONGO_DATABASE || 'test';
const uriMongo = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/`;
console.log('uriMongo mongo.enum:', uriMongo);

export const mongodbConfig = (configService: ConfigService) => {
  const dbUser = configService.get('MONGO_USERNAME');
  const dbPassword = configService.get('MONGO_PASSWORD');
  const dbHost = configService.get('MONGO_HOST');
  const dbPort = configService.get('MONGO_PORT');
  const dbName = configService.get('MONGO_DATABASE');

  const uri = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
  return { uri, dbName } as MongooseModuleFactoryOptions;
};

export const MongoConfig = {
  uri: uriMongo,
  dbName: dbName,
};
