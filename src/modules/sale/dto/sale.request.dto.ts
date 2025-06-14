import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsPositive, ValidateNested } from 'class-validator';

export class SaleStatusResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Completed' })
  name: string;

  @ApiProperty({ example: 'The sale was completed successfully' })
  description: string;
}

export class SaleDetailRequestDto {
  @ApiProperty()
  @IsPositive()
  product_id: number;

  @ApiProperty()
  @IsPositive()
  quantity: number;

  @ApiProperty()
  @IsPositive()
  unit_price: number;

  @ApiProperty()
  subTotal: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  tax_amount: number;

  @ApiProperty()
  total_line: number;
}
export class SaleRequestDto {
  @ApiProperty()
  @IsPositive()
  client_id: number;

  @ApiProperty()
  guest_name: string;

  @ApiProperty()
  guest_email: string;

  @ApiProperty()
  guest_phone: string;

  @ApiProperty()
  @IsPositive()
  total: number;

  @ApiProperty()
  @IsPositive()
  payment_method_id: number;

  @ApiProperty()
  guest_document_type: number;

  @ApiProperty()
  guest_document_number: string;

  @ApiProperty()
  comments: string;

  @ApiProperty()
  register_number: string;

  @ApiProperty()
  transfer_number: string;

  @ApiProperty()
  @IsPositive()
  document_type_sale_id: number;

  @ApiProperty()
  order_id: number;

  @ApiProperty()
  branch_id: number;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  total_discount: number;

  @ApiProperty()
  total_tax_amount: number;

  @ApiProperty()
  total_sale: number;

  @ApiProperty()
  cashier_id: number;

  @ApiProperty()
  manager_id: number;

  @ApiProperty({ type: [SaleDetailRequestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleDetailRequestDto)
  details: SaleDetailRequestDto[];
}
export class SaleAuthorizeDiscountDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  manager_id: number;

  @ApiProperty({ example: 'password' })
  manager_password: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  product_id: number;

  @ApiProperty({ example: 10 })
  discount_percentage: number;

  @ApiProperty({ example: 15 })
  discount_value: number;
}

export class ValidateMasterPassword {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  manager_id: number;

  @ApiProperty({ example: 'password' })
  manager_password: string;

}
