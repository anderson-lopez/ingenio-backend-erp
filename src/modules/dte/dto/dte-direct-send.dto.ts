// dto/dte-direct-send.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class DteDirectSendDto {
  @ApiProperty({
    type: 'object',
    example: {
      identificacion: {
        version: 1,
        ambiente: '00',
        tipoDte: '01',
        numeroControl: 'DTE-01-S001P001-000000000000015',
        tipoModelo: 1,
        tipoOperacion: 1,
        fecEmi: '2025-06-06',
        horEmi: '12:30:00',
        tipoMoneda: 'USD',
        codigoGeneracion: 'B343043D-907D-4F6D-A3E3-2C3CAE1BFD8E'
      },
      emisor: {
        nit: '06230503251130',
        nrc: '3599354',
        nombre: 'EL INGENIO 360, S.A. de C.V.',
        codActividad: '62020',
        descActividad: 'Consultorías y gestión de servicios informáticos',
        nombreComercial: 'EL INGENIO 360',
        tipoEstablecimiento: '02',
        direccion: {
          departamento: '10',
          municipio: '14',
          complemento: 'Col. Centro, Calle Principal #1234'
        },
        telefono: '22223333',
        correo: 'ventas@miempresa.com'
      },
      receptor: {
        tipoDocumento: '36',
        numDocumento: '06140403091020',
        nrc: '1927946',
        nombre: 'Aquarius Ecotours, S.A. de C.V.',
        codActividad: '49229',
        descActividad: 'Transporte de pasajeros por vía terrestre n.c.p.',
        direccion: {
          departamento: '01',
          municipio: '14',
          complemento: 'Col. Miramonte, Calle Secundaria #4321'
        },
        telefono: '22223333',
        correo: 'ventas@Aquarius.com'
      },
      cuerpoDocumento: [
        {
          numItem: 1,
          tipoItem: 1,
          codigo: '868',
          descripcion: 'ORDEN DE MINITROQUES 6U.',
          cantidad: 1,
          uniMedida: 59,
          precioUni: 2.49,
          montoDescu: 0,
          ventaGravada: 2.49,
          ivaItem: 0.29
        }
      ],
      resumen: {
        totalIva: 0.29,
        totalGravada: 2.49,
        subTotalVentas: 2.49,
        totalPagar: 2.49,
        totalLetras: 'DOS CON 49/100 DOLARES',
        condicionOperacion: 1,
        pagos: [
          {
            codigo: '01',
            montoPago: 2.49
          }
        ]
      }
    }
  })
  @IsObject()
  dte: Record<string, any>;

  @ApiProperty({
    example: '1'
  })
  @IsString()
  emisor_id: string;

  @ApiProperty({
    example: '14'
  })
  @IsString()
  tipo_dte: string;

  @ApiProperty({
    example: '06230503251130'
  })
  @IsString()
  usuario: string;
}
