import { ApiProperty } from '@nestjs/swagger';

export class PurchaseRequestDto {
  @ApiProperty({ example: 1 })
  supplier_id: number;

  @ApiProperty({ example: 2 })
  payment_method_id: number;

  @ApiProperty({ example: 3 })
  document_type_id: number;

  @ApiProperty({ example: 1 })
  branch_id: number;

  @ApiProperty({ example: 150.50 })
  total_purchase: number;

  @ApiProperty({ example: '2024-06-14T00:00:00Z' })
  purchase_date: string;

  @ApiProperty({ type: () => [PurchaseDetailDto] })
  details: PurchaseDetailDto[];
}

export class PurchaseDetailDto {
  @ApiProperty()
  product_id: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unit_price: number;

  @ApiProperty()
  sub_total: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  tax_amount: number;

  @ApiProperty()
  total_line: number;
}
