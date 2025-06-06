import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class PurchaseDetailRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  product_id: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  unit_price: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  sub_total: number;

  @ApiProperty()
  @IsNumber()
  discount: number;

  @ApiProperty()
  @IsNumber()
  tax_amount: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  total_line: number;
}

export class PurchaseRequestDto {
  
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  supplier_id: number;

  @ApiProperty()
  @IsString()
  purchase_date: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  invoice_number: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  payment_method_id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comments: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  document_type_id: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  branch_id: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  subtotal: number;

  @ApiProperty()
  @IsNumber()
  discount_total: number;

  @ApiProperty()
  @IsNumber()
  tax_total: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  total_purchase: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  cashier_id: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  manager_id: number;

  @ApiProperty({ type: [PurchaseDetailRequestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseDetailRequestDto)
  details: PurchaseDetailRequestDto[];
}

export class PurchaseAuthorizeDiscountDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  manager_id: number;

  @ApiProperty({ example: 'password' })
  @IsString()
  manager_password: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  product_id: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsPositive()
  discount_percentage: number;

  @ApiProperty({ example: 15 })
  @IsNumber()
  @IsPositive()
  discount_value: number;
}

export class ValidateMasterPassword {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  manager_id: number;

  @ApiProperty({ example: 'password' })
  @IsString()
  manager_password: string;

  
}
