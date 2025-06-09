import { Module } from '@nestjs/common';
import { ContabilidadController } from './controllers/contabilidad.controller';
import { ContabilidadService } from './services/contabilidad.service';

@Module({
    controllers: [ContabilidadController],
    providers: [ContabilidadService],
  })
  export class ContabilidadModule {}