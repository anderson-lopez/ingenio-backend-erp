import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdatePurchaseStatusDto {
  @ApiProperty({ example: 2, description: 'Nuevo estado de la compra' })
  @IsNumber()
  @IsPositive()
  purchase_status_id: number;
}
