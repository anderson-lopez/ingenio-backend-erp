import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class ClientRequestDto {
  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  nationality: string;

  @ApiProperty()
  birth_date: Date;

  @ApiProperty({ example: 1 })
  @IsPositive({ message: 'gender_id debe ser un número positivo' })
  gender_id: number;

  @ApiProperty({ example: 1 })
  @IsPositive({ message: 'marital_status_id debe ser un número positivo' })
  marital_status_id: number;

  @ApiProperty()
  dui_number: string;

  @ApiProperty()
  nit_number: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  mobile_number: string;

  @ApiProperty()
  company_number: string;

  @ApiProperty()
  office_number: string;

  @ApiProperty()
  fax_number: string;

  @ApiProperty()
  full_address: string;

  @ApiProperty()
  postal_code: string;

  @ApiProperty()
  company_name: string;

  @ApiProperty()
  company_nit: string;

  @ApiProperty()
  company_address: string;

  // indica el tipo de membresia si es GOLDEN, DIAMANTE, ETC
  @ApiProperty({ example: 1 })
  @IsPositive({ message: 'client_category_id debe ser un número positivo' })
  client_category_id: number;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  end_date: Date;

  @ApiProperty()
  branch_id: number;

  @ApiProperty()
  document_type_id: number;

  @ApiProperty()
  department_id: number;

  @ApiProperty()
  municipality_id: number;

  @ApiProperty()
  district_id: number;

  @ApiProperty()
  street: string;

  @ApiProperty()
  client_type: number; // INDIVIDUAL o EMPRESA

  @ApiProperty()
  ncr_number: string;

  @ApiProperty()
  economic_activity_id: number;

}
