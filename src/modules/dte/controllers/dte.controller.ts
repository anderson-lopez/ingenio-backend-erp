// controllers/dte.controller.ts
import {
  Body,
  Controller,
  Post,
  Logger,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { DteService } from '../services/dte.service';
import { DteBuildDto } from '../dto/dte-build.dto';
import { SignDteDto, SendSignedDteDto } from '../dto/dte.dto';
import { DteDirectSendDto } from '../dto/dte-direct-send.dto';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Dte')
@Controller('dte')
export class DteController {
  private readonly logger = new Logger(DteController.name);

  constructor(private readonly dteService: DteService) {}

  /** 0. Endpoint opcional para forzar autenticación o ver el token */
  @Get('token')
  async getToken() {
    this.logger.log('🔑 Solicitud manual de token…');
    const token = await this.dteService.fetchToken();   // ← siempre válido
    return { token };
  }

  /** 1. Recibe DTE crudo del formulario */
  @Post('build')
  @HttpCode(HttpStatus.OK)
  buildDte(@Body() dteBuild: DteBuildDto) {
    this.logger.log('📥 DTE recibido del frontend');
    return dteBuild;        // aquí podrías guardarlo en BD
  }

  /** 2. Firma el DTE (no requiere token de Hacienda) */
  @Post('sign')
  async sign(@Body() dto: SignDteDto) {
    this.logger.log('✏️ Firmando DTE…');
    return this.dteService.signDocument(dto.dte);
  }

  /** 3. Envía el DTE firmado a Hacienda (requiere token) */
  @Post('send')
  async send(@Body() dto: SendSignedDteDto) {
    this.logger.log('🚀 Enviando DTE firmado a Hacienda…');
    // sendToHacienda llama internamente a getValidToken()
    return this.dteService.sendToHacienda(dto.signedDte);
  }

  @Post('send-direct')
  @ApiOperation({ summary: 'Firma y envía un DTE directamente a Hacienda' })
  @ApiResponse({ status: 201, description: 'DTE firmado y enviado exitosamente' })
  async sendDirect(@Body() dto: DteDirectSendDto) {
    this.logger.log('📥 Datos recibidos para firma y envío directo:', dto);
    const response = await this.dteService.sendDteDirectly(dto);
    return {
      message: '✅ DTE firmado y enviado a Hacienda exitosamente',
      haciendaResponse: response,
    };
  }


}
