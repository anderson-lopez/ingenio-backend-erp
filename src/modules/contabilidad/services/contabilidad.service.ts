import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ContabilidadService {
  constructor(private readonly dataSource: DataSource) {}

  async getTotalIngresos() {
    const result = await this.dataSource.query(`
      SELECT COALESCE(SUM(total), 0)::numeric(10,2) AS "totalIngresos"
      FROM sales
    `);
    return { totalIngresos: parseFloat(result[0].totalIngresos) };
  }

  async getTotalGastos() {
    const result = await this.dataSource.query(`
      SELECT COALESCE(SUM(total), 0)::numeric(10,2) AS "totalGastos"
      FROM "Purchases"
    `);
    return { totalGastos: parseFloat(result[0].totalGastos) };
  }

  async getTotalBeneficio() {
    const ingresos = (await this.getTotalIngresos()).totalIngresos;
    const gastos = (await this.getTotalGastos()).totalGastos;
    return { totalBeneficio: ingresos - gastos };
  }

  async getMargenPorcentaje() {
    const ingresos = (await this.getTotalIngresos()).totalIngresos;
    const gastos = (await this.getTotalGastos()).totalGastos;
    const beneficio = ingresos - gastos;
    const margen = ingresos > 0 ? (beneficio / ingresos) * 100 : 0;
    return { margenPorcentaje: parseFloat(margen.toFixed(1)) };
  }

  async getBeneficiosMensuales() {
    const beneficiosMensuales = [];

    for (let mes = 1; mes <= 12; mes++) {
      const ventasResult = await this.dataSource.query(`
        SELECT COALESCE(SUM(total), 0)::numeric(10,2) AS "totalVentas"
        FROM sales
        WHERE EXTRACT(MONTH FROM sale_date) = $1
          AND EXTRACT(YEAR FROM sale_date) = $2
      `, [mes, new Date().getFullYear()]);

      const comprasResult = await this.dataSource.query(`
        SELECT COALESCE(SUM(total), 0)::numeric(10,2) AS "totalCompras"
        FROM "Purchases"
        WHERE EXTRACT(MONTH FROM purchase_date) = $1
          AND EXTRACT(YEAR FROM purchase_date) = $2
      `, [mes, new Date().getFullYear()]);

      const totalVentas = parseFloat(ventasResult[0].totalVentas);
      const totalCompras = parseFloat(comprasResult[0].totalCompras);

      const beneficio = totalVentas - totalCompras;

      beneficiosMensuales.push({
        mes: this.getNombreMes(mes),
        monto: beneficio,
      });
    }

    return { beneficiosMensuales };
  }

  private getNombreMes(mes: number): string {
    const meses = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
    ];
    return meses[mes - 1];
  }

  async exportarReporte() {
    const buffer = Buffer.from('PDF de reporte contable', 'utf-8');
    return buffer;
  }
}
