import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePurchaseDocumentDto {
  @ApiProperty({ example: '/uploads/purchase_2.pdf', description: 'Ruta o nombre del archivo PDF' })
  @IsString()
  document_path: string;
}
