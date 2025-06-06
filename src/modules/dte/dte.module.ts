import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';   // ⬅️ nuevo import
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { DteController } from './controllers/dte.controller';
import { DteService } from './services/dte.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.register({ timeout: 15000 }),
    CacheModule.register({                 // memoria por defecto
      isGlobal: true,                      // disponible en toda la app
      ttl: 0,                              // expiración la manejamos manual
    }),
  ],
  controllers: [DteController],
  providers: [DteService],
})
export class DteModule {}
