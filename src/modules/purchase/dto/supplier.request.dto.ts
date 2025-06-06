import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class SupplierRequestDto {
  @ApiProperty({ description: 'Nombre del proveedor' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Nombre del contacto' })
  @IsString()
  contact_name: string;

  @ApiProperty({ description: 'Correo electrónico del proveedor' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Número de teléfono' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Dirección del proveedor' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Sitio web del proveedor', required: false })
  @IsOptional()
  @IsString()
  website: string;

  @ApiProperty({ description: 'Notas adicionales sobre el proveedor', required: false })
  @IsOptional()
  @IsString()
  notes: string;

  @ApiProperty({ description: 'Términos de pago en días' })
  @IsNumber()
  @IsPositive()
  payment_terms: number;
}
