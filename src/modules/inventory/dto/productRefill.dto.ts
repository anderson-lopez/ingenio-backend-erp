import { ApiProperty } from "@nestjs/swagger";

export class CreateProductRefillDto {
    @ApiProperty()
    origin_branch_id: number;

    @ApiProperty()
    destiny_branch_id: number;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    product_id: number;
}