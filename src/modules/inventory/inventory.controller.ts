import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { InventoryService } from './services/inventory.service';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CreateProductDto,
  CreateProductImageDto,
  CreateProductInventoryDto,
  UpdateProductDto,
  UpdateProductInventoryNewDto,
} from './dto/product.dto';
import { ValidateNested } from 'class-validator';
import { CreateProductRefillDto } from './dto/productRefill.dto';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }

  @ApiParam({ name: 'branchId', type: Number })
  @Get('/products/branch/:branchId')
  async findProductsByBranch(@Param('branchId') branchId: number) {
    return this.inventoryService.findProductsByBranch(branchId);
  }

  @Get('/summary/branchs')
  @ApiOperation({ summary: 'Get total inventory summary by branchs' })
  async getInventorySummaryByBranch() {
    return this.inventoryService.getInventorySummaryByBranch();
  }

  @Get('/summary/branchs/:productId')
  @ApiOperation({
    summary: 'Get total inventory summary stock on branchs by product',
  })
  @ApiParam({ name: 'productId', type: Number })
  async getInventorySummaryByBranchProduct(
    @Param('productId') productId: number,
  ) {
    return this.inventoryService.getInventorySummaryBranchByProduct(productId);
  }

  @Get('/branchs')
  @ApiOperation({ summary: 'Get all branchs' })
  async getBranchs() {
    return this.inventoryService.getBranchs();
  }

  @Get('/products/branch/:branchId/product/:productId')
  @ApiOperation({
    summary:
      'Get product inventory information for WMS section by branch and product',
  })
  @ApiParam({ name: 'branchId', type: Number })
  @ApiParam({ name: 'productId', type: Number })
  async getProductInventoryByBranchProduct(
    @Param('branchId') branchId: number,
    @Param('productId') productId: number,
  ) {
    return this.inventoryService.getProductInventoryByBranchAndProduct(
      branchId,
      productId,
    );
  }

  @Get('/refill-history/product/:productId')
  @ApiOperation({ summary: 'Get refill history by product' })
  @ApiParam({ name: 'productId', type: Number })
  async getProductRefillHistory(@Param('productId') productId: number) {
    return this.inventoryService.getProductRefillHistory(productId);
  }

  @Post('refill')
  @ApiOperation({ summary: 'Create a new refill for product' })
  async createRefill(@Body() request: CreateProductRefillDto) {
    return this.inventoryService.createProductRefill(request);
  }

  @Get('/refill/stock/:product_id/branch/:branch_id')
  @ApiOperation({
    summary:
      'Get stock for refill by product and branch, this is used to get the stock for refill',
  })
  @ApiParam({ name: 'product_id', type: Number })
  @ApiParam({ name: 'branch_id', type: Number })
  async getStockForRefill(
    @Param('product_id') productId: number,
    @Param('branch_id') branchId: number,
  ) {
    return this.inventoryService.getMaxStockByBranchAndProduct(productId, branchId);
  }

  // getRefillSmartRecomendations
  @Get('/refill/smart_recomendations/product/:product_id')
  @ApiOperation({
    summary:
      'Get smart recomendations for refill, this is used to get the stock for refill',
  })
  @ApiParam({ name: 'product_id', type: Number })
  async getRefillSmartRecomendations(
    @Param('product_id') productId: number,
  ) {
    return this.inventoryService.getRefillSmartRecomendations(productId);
  }

  @Get('/refill/last_refill/product/:product_id')
  @ApiOperation({
    summary: 'Get last refill by product',
  })
  @ApiParam({ name: 'product_id', type: Number })
  async getLastRefillByProduct(
    @Param('product_id') productId: number,
  ) {
    return this.inventoryService.getLastRefillByProduct(productId);
  }

  @Post('/product')
  @ApiOperation({ summary: 'Create a new product' })
  async createProduct(@Body() request: CreateProductDto) {
    return this.inventoryService.createProduct(request);
  }

  @Put('/product')
  @ApiOperation({ summary: 'Update the general information and images to specific product' })
  async updateProduct(@Body() request: UpdateProductDto) {
    return this.inventoryService.updateProduct(request);
  }

  @Post('/product/images')
  @ApiOperation({ summary: 'Add Images for a specific product' })
  @ApiBody({ type: CreateProductImageDto, isArray: true })
  @ValidateNested({ each: true })
  async addProductImage(@Body() request: CreateProductImageDto[]) {
    return this.inventoryService.addProductImages(request);
  }

  @Post('/product_branch')
  @ApiOperation({ summary: 'Add inventory from a product and branch' })
  @ApiBody({ type: CreateProductInventoryDto, isArray: true })
  async addProductInventory(@Body() request: CreateProductInventoryDto[]) {
    return this.inventoryService.createInventoryToBranch(request);
  }

  @Put('/product_branch')
  @ApiOperation({ summary: 'Update inventory WMS section to a product and specific branch' })
  @ApiBody({ type: UpdateProductInventoryNewDto, isArray: false })
  async updateProductInventory(@Body() request: UpdateProductInventoryNewDto) {
    console.log(request);
    return this.inventoryService.updateInventoryToBranch(request);
  }

  @Get('/product_summary')
  @ApiOperation({ summary: 'Get product summary' })
  async getProductSummary() {
    return this.inventoryService.getProductSummary();
  }

  @Get('/product_rotation')
  @ApiOperation({ summary: 'Get product rotations list' })
  async getProductRotation() {
    return this.inventoryService.getAllProductRotations();
  }

  @Get('rack_zones')
  @ApiOperation({ summary: 'Get all rack zones' })
  async getRackZones() {
    return this.inventoryService.getAllRackZones();
  }

  @Get('level_zones')
  @ApiOperation({ summary: 'Get all level zones' })
  async getLevelZones() {
    return this.inventoryService.getAllLevelZones();
  }
}
