import { Controller, Get, Res } from '@nestjs/common';
import { ContabilidadService } from '../services/contabilidad.service';

@Controller('contabilidad')
export class ContabilidadController {
  constructor(private readonly contabilidadService: ContabilidadService) {}

  @Get('ingresos')
  getTotalIngresos() {
    return this.contabilidadService.getTotalIngresos();
  }

  @Get('gastos')
  getTotalGastos() {
    return this.contabilidadService.getTotalGastos();
  }

  @Get('beneficio')
  getTotalBeneficio() {
    return this.contabilidadService.getTotalBeneficio();
  }

  @Get('margen')
  getMargenPorcentaje() {
    return this.contabilidadService.getMargenPorcentaje();
  }

  @Get('beneficios-mensuales')
  getBeneficiosMensuales() {
    return this.contabilidadService.getBeneficiosMensuales();
  }

  @Get('exportar-reporte')
  async exportarReporte(@Res() res) {
    const reporte = await this.contabilidadService.exportarReporte();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="reporte-contabilidad.pdf"',
    });
    res.send(reporte);
  }
}
