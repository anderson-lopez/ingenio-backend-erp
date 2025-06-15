import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePurchaseWmsDto {
  @ApiProperty({ example: 'WMS12345', description: 'Código WMS relacionado' })
  @IsString()
  wms_code: string;
}
