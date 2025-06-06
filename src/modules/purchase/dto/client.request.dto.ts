import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
  IsEmail,
} from 'class-validator';

export class ClientRequestDto {
  @ApiProperty({ description: 'Primer nombre del cliente' })
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'Apellido del cliente' })
  @IsString()
  last_name: string;

  @ApiProperty({ description: 'Nacionalidad del cliente' })
  @IsString()
  nationality: string;

  @ApiProperty({ type: String, format: 'date-time', description: 'Fecha de nacimiento' })
  birth_date: Date;

  @ApiProperty({ example: 1, description: 'ID del género' })
  @IsPositive()
  gender_id: number;

  @ApiProperty({ example: 1, description: 'ID del estado civil' })
  @IsPositive()
  marital_status_id: number;

  @ApiProperty({ description: 'Número de DUI', required: false })
  @IsOptional()
  @IsString()
  dui_number: string;

  @ApiProperty({ description: 'Número de NIT', required: false })
  @IsOptional()
  @IsString()
  nit_number: string;

  @ApiProperty({ description: 'Correo electrónico' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Número de móvil', required: false })
  @IsOptional()
  @IsString()
  mobile_number: string;

  @ApiProperty({ description: 'Número de la empresa', required: false })
  @IsOptional()
  @IsString()
  company_number: string;

  @ApiProperty({ description: 'Número de la oficina', required: false })
  @IsOptional()
  @IsString()
  office_number: string;

  @ApiProperty({ description: 'Número de fax', required: false })
  @IsOptional()
  @IsString()
  fax_number: string;

  @ApiProperty({ description: 'Dirección completa' })
  @IsString()
  full_address: string;

  @ApiProperty({ description: 'Código postal' })
  @IsString()
  postal_code: string;

  @ApiProperty({ description: 'Nombre de la empresa', required: false })
  @IsOptional()
  @IsString()
  company_name: string;

  @ApiProperty({ description: 'NIT de la empresa', required: false })
  @IsOptional()
  @IsString()
  company_nit: string;

  @ApiProperty({ description: 'Dirección de la empresa', required: false })
  @IsOptional()
  @IsString()
  company_address: string;

  @ApiProperty({ example: 1, description: 'ID de la categoría del cliente' })
  @IsPositive()
  client_category_id: number;

  @ApiProperty({ type: String, format: 'date-time', description: 'Fecha de inicio' })
  @IsDate()
  start_date: Date;

  @ApiProperty({ type: String, format: 'date-time', description: 'Fecha de fin' })
  @IsDate()
  end_date: Date;

  @ApiProperty({ description: 'ID de la sucursal' })
  @IsPositive()
  branch_id: number;

  @ApiProperty({ description: 'ID del tipo de documento' })
  @IsPositive()
  document_type_id: number;

  @ApiProperty({ description: 'ID del departamento' })
  @IsPositive()
  department_id: number;

  @ApiProperty({ description: 'ID del municipio' })
  @IsPositive()
  municipality_id: number;

  @ApiProperty({ description: 'ID del distrito' })
  @IsPositive()
  district_id: number;

  @ApiProperty({ description: 'Nombre de la calle' })
  @IsString()
  street: string;

  @ApiProperty({ description: '0 = INDIVIDUAL, 1 = EMPRESA' })
  @IsNumber()
  client_type: number;

  @ApiProperty({ description: 'Número de NCR', required: false })
  @IsOptional()
  @IsString()
  ncr_number: string;

  @ApiProperty({ description: 'ID de la actividad económica' })
  @IsPositive()
  economic_activity_id: number;
}
