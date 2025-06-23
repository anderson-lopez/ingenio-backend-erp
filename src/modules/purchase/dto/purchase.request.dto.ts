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
  
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  supplier_id: number;

  @ApiProperty({ example: '2025-06-06T00:00:00Z' })
  @IsString()
  purchase_date: string;

  @ApiProperty({ example: 'INV12345' })
  @IsOptional()
  @IsString()
  invoice_number: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  payment_method_id: number;

  @ApiProperty({ example: 'Comentario de prueba' })
  @IsOptional()
  @IsString()
  comments: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  document_type_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  branch_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  PurchaseStatusId: number;

  @ApiProperty({ example: 100.00 })
  @IsNumber()
  @IsPositive()
  subtotal: number;

  @ApiProperty({ example: 0.00 })
  @IsNumber()
  discount_total: number;

  @ApiProperty({ example: 0.00 })
  @IsNumber()
  tax_total: number;

  @ApiProperty({ example: 100.00 })
  @IsNumber()
  @IsPositive()
  total_purchase: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  cashier_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  manager_id: number;

  @ApiProperty({
    type: [PurchaseDetailRequestDto],
    example: [
      {
        product_id: 1,
        quantity: 2,
        unit_price: 50.00,
        sub_total: 100.00,
        discount: 0,
        tax_amount: 0,
        total_line: 100.00
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseDetailRequestDto)
  details: PurchaseDetailRequestDto[];

  @ApiProperty({ example: 1, description: 'ID del usuario que está creando la compra' })
  @IsNumber()
  @IsPositive()
  id_user: number;

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
