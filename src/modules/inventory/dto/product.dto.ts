import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsPositive, ValidateNested } from 'class-validator';
import { SaleDetailRequestDto } from 'src/modules/sale/dto/sale.request.dto';



export class CreateProductDtoGeneralInformation {
  @ApiProperty()
  name: string;

  @ApiProperty()
  sku_code: string;

  @ApiProperty()
  @IsPositive()
  subcategory_id: number;

  @ApiProperty()
  @IsPositive()
  sale_price: number;

  @ApiProperty({ example: '2022-12-31' })
  expire_date: string;

  @ApiProperty()
  comments: string;

  @ApiProperty()
  weight_kg: number;

  @ApiProperty()
  length_cm: number;

  @ApiProperty()
  width_cm: number;

  @ApiProperty()
  height_cm: number;

  @ApiProperty()
  units_per_box: number;

  @ApiProperty()
  warehouse_cost: number;

  @ApiProperty()
  offer_price: number;

  @ApiProperty()
  internal_code: string;

  @ApiProperty()
  barcode_number: string;

  @ApiProperty()
  provider_number: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  location_san_salvador: string;
}

export class UpdateProductDtoGeneralInformation {
  @ApiProperty()
  product_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  sku_code: string;

  @ApiProperty()
  @IsPositive()
  subcategory_id: number;

  @ApiProperty()
  @IsPositive()
  sale_price: number;

  @ApiProperty({ example: '2022-12-31' })
  expire_date: string;

  @ApiProperty()
  comments: string;

  @ApiProperty()
  weight_kg: number;

  @ApiProperty()
  length_cm: number;

  @ApiProperty()
  width_cm: number;

  @ApiProperty()
  height_cm: number;

  @ApiProperty()
  units_per_box: number;

  @ApiProperty()
  warehouse_cost: number;

  @ApiProperty()
  offer_price: number;

  @ApiProperty()
  internal_code: string;

  @ApiProperty()
  barcode_number: string;

  @ApiProperty()
  provider_number: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  location_san_salvador: string;
}

export class CreateProductImageDto {
  @ApiProperty()
  product_image_mongo_id: string;

  @ApiProperty()
  is_cover: boolean;

  @ApiProperty()
  is_gallery: boolean;

  @ApiProperty()
  is_barcode: boolean;

  @ApiProperty()
  @IsPositive()
  product_id: number;

  @ApiProperty()
  mongo_bucket_name: string;
}

export class CreateProductImageDtoNew {
  @ApiProperty()
  product_image_mongo_id: string;

  @ApiProperty()
  is_cover: boolean;

  @ApiProperty()
  is_gallery: boolean;

  @ApiProperty()
  is_barcode: boolean;

  @ApiProperty()
  mongo_bucket_name: string;
}

export class UpdateProductImage {
  @ApiProperty()
  product_image: string;

  @ApiProperty()
  is_cover: boolean;

  @ApiProperty()
  is_gallery: boolean;

  @ApiProperty()
  is_barcode: boolean;

  @ApiProperty()
  mongo_bucket_name: string;
}

export class CreateProductInventoryDto {
  @ApiProperty()
  min_stock: number;

  @ApiProperty()
  max_stock: number;

  @ApiProperty()
  current_stock: number;

  @ApiProperty()
  product_rotation_id: number;

  @ApiProperty()
  warehouse_zone_location: string;

  @ApiProperty()
  rack_zone_id: number;

  @ApiProperty()
  level_zone_id: number;

  @ApiProperty()
  bin: string;

  @ApiProperty()
  alternative_zone_location: string;

  @ApiProperty()
  alternative_level_zone_id: number;

  @ApiProperty()
  alternative_rack_zone_id: number;

  @ApiProperty()
  stock_life_cycle_days: number;

  @ApiProperty()
  is_fifo: boolean;

  @ApiProperty()
  is_fefo: boolean;

  @ApiProperty()
  average_picking_minutes: number;

  @ApiProperty()
  product_id: number;

  @ApiProperty()
  branch_id: number;
}

export class CreateProductInventoryNewDto {

  @ApiProperty()
  product_rotation_id: number;

  @ApiProperty()
  warehouse_zone_location: string;

  @ApiProperty()
  rack_zone_id: number;

  @ApiProperty()
  level_zone_id: number;

  @ApiProperty()
  bin: string;

  @ApiProperty()
  alternative_zone_location: string;

  @ApiProperty()
  alternative_level_zone_id: number;

  @ApiProperty()
  alternative_rack_zone_id: number;

  @ApiProperty()
  stock_life_cycle_days: number;

  @ApiProperty()
  is_fifo: boolean;

  @ApiProperty()
  is_fefo: boolean;

  @ApiProperty()
  average_picking_minutes: number;

}

export class UpdateProductInventoryNewDto {
  @ApiProperty()
  product_rotation_id: number;

  @ApiProperty()
  warehouse_zone_location: string;

  @ApiProperty()
  rack_zone_id: number;

  @ApiProperty()
  level_zone_id: number;

  @ApiProperty()
  bin: string;

  @ApiProperty()
  alternative_zone_location: string;

  @ApiProperty()
  alternative_level_zone_id: number;

  @ApiProperty()
  alternative_rack_zone_id: number;

  @ApiProperty()
  stock_life_cycle_days: number;

  @ApiProperty()
  is_fifo: boolean;

  @ApiProperty()
  is_fefo: boolean;

  @ApiProperty()
  average_picking_minutes: number;

  @ApiProperty()
  product_id: number;

  @ApiProperty()
  branch_id: number;
}

export class CreateProductDto {
  @ApiProperty({ type: CreateProductDtoGeneralInformation })
  general_information: CreateProductDtoGeneralInformation

  @ApiProperty({ type: CreateProductInventoryNewDto })
  wms_information: CreateProductInventoryNewDto

  @ApiProperty({ type: [CreateProductImageDtoNew] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDtoNew)
  product_images: CreateProductImageDtoNew[]

}

export class UpdateProductDto {
  @ApiProperty({ type: UpdateProductDtoGeneralInformation })
  general_information: UpdateProductDtoGeneralInformation

  @ApiProperty({ type: [UpdateProductImage] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductImage)
  product_images: UpdateProductImage[]

}
