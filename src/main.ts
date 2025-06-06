import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RouterExplorer } from '@nestjs/core/router/router-explorer';

async function bootstrap() {
  const logger = new Logger('ApiGateway');
  const basePath = process.env.BASE_PATH || 'api/v1';
  const host = process.env.HOST || 'localhost';
  const port = +process.env.PORT || 3000;
  const corsOriginUrl = process.env.CORS_ORIGIN_URL || '*';
  const app = await NestFactory.create(AppModule);

  // 👇 Agregar un log global de rutas
  app.use((req, res, next) => {
    console.log('🔍 Ruta llamada:', req.method, req.url);
    next();
  });

  

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // Elimina propiedades que no están en el DTO
      forbidNonWhitelisted: false, // Lanza un error si hay propiedades no permitidas
      transform: true, // Transforma los objetos a las instancias de los DTOs
    }),
  );

  // enable cors
  app.enableCors({
    origin: corsOriginUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept',
  });

  const config = new DocumentBuilder()
    .setTitle('API GATEWAY')
    .setDescription('The API GATEWAY for the application')
    .setVersion('1.0')
    .addTag('API GATEWAY')
    .addServer(basePath)
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.setGlobalPrefix(basePath);
  await app.listen(port, host);
  logger.log(`Application is running on: http://${host}:${port}/${basePath}`);
  logger.log(`Swagger is running on: http://${host}:${port}/docs`);
}
bootstrap();
