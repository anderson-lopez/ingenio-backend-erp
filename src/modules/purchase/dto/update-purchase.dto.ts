import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class UpdatePurchaseDetailDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  product_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  unit_price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sub_total?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  tax_amount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  total_line?: number;
}

export class UpdatePurchaseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  supplier_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  purchase_date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  invoice_number?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  payment_method_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  document_type_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  branch_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  subtotal?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  discount_total?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  tax_total?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  total_purchase?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  cashier_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  manager_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  order_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wms_code?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  document_path?: string;


  @ApiPropertyOptional({ type: [UpdatePurchaseDetailDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePurchaseDetailDto)
  details?: UpdatePurchaseDetailDto[];
}
