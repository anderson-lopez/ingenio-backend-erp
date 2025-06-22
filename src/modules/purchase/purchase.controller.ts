import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags, ApiBody, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { PurchaseService } from './services/purchase.service';
import { Permissions } from 'src/common/security/permissions.decorator';
import {
  PurchaseAuthorizeDiscountDto,
  PurchaseRequestDto,
  ValidateMasterPassword,
} from './dto/purchase.request.dto';
import { SupplierRequestDto } from './dto/supplier.request.dto';
import { UpdatePurchaseStatusDto } from './dto/UpdatePurchaseStatusDto.dto';
import { UpdatePurchaseWmsDto } from './dto/UpdatePurchaseWmsDto.dto';
import { UpdatePurchaseDocumentDto } from './dto/UpdatePurchaseDocumentDto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MongoClient, ObjectId, GridFSBucket } from 'mongodb';
import { Response as ExpressResponse } from 'express';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';  // 👉 Asegúrate que exista este DTO y ajusta la ruta


@ApiTags('Purchase')
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {
    console.log('✅ PurchaseController inicializado');
  }

  @Post()
  @Permissions('create_purchase')
  @ApiOperation({ summary: 'Create a new purchase' })
  @ApiBody({ type: PurchaseRequestDto })
  @ApiResponse({ status: 201, description: 'Purchase created successfully' })
  createPurchase(@Body() purchase: PurchaseRequestDto) {
    console.log('🔎 Llamado POST /purchase');
    return this.purchaseService.createPurchase(purchase);
  }

  @Get()
  @Permissions('read_purchases')
  @ApiOperation({ summary: 'Get all purchases' })
  @ApiResponse({ status: 200, description: 'List of purchases' })
  getPurchases() {
    console.log('🔎 Llamado GET /purchase');
    return this.purchaseService.getAllPurchases();
  }



  @Post('product/authorize_discount')
  @Permissions('authorize_discount_purchase')
  @ApiOperation({ summary: 'Authorize Discount with password manager for specific product' })
  @ApiBody({ type: PurchaseAuthorizeDiscountDto })
  @ApiResponse({ status: 201, description: 'Discount authorized' })
  authorizeDiscount(@Body() request: PurchaseAuthorizeDiscountDto) {
    console.log('🔎 Llamado POST /purchase/product/authorize_discount');
    return this.purchaseService.authorizeProductDiscount(request);
  }

  @Post('product/validate_manager_password')
  @Permissions('validate_manager_password_purchase')
  @ApiOperation({ summary: 'Validate manager password for discount authorization' })
  @ApiBody({ type: ValidateMasterPassword })
  @ApiResponse({ status: 201, description: 'Password validated' })
  validatePassword(@Body() request: ValidateMasterPassword) {
    console.log('🔎 Llamado POST /purchase/product/validate_manager_password');
    return this.purchaseService.validateManagerPassword(request);
  }

  @Get('all-suppliers')
  @Permissions('read_suppliers')
  @ApiOperation({ summary: 'Get all suppliers' })
  @ApiResponse({ status: 200, description: 'List of suppliers' })
  getSuppliers() {
    console.log('🔎 Llamado GET /purchase/all-suppliers');
    return this.purchaseService.getAllSuppliers();
  }



  @Post('suppliers')
  @Permissions('create_suppliers')
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiBody({ type: SupplierRequestDto })
  @ApiResponse({ status: 201, description: 'Supplier created successfully' })
  createSupplier(@Body() supplier: SupplierRequestDto) {
    console.log('🔎 Llamado POST /purchase/suppliers');
    return this.purchaseService.createSupplier(supplier);
  }

  // Nuevo endpoint que solo devuelve el ID
  @Post('suppliers/only-id')
  async createSupplierN(@Body() dto: SupplierRequestDto) {
    return this.purchaseService.createSupplierN(dto);
  }

  @Get('payment-methods')
  @Permissions('read_payment_methods')
  @ApiOperation({ summary: 'Get all payment methods' })
  @ApiResponse({ status: 200, description: 'List of payment methods' })
  getPaymentMethods() {
    console.log('🔎 Llamado GET /purchase/payment-methods');
    return this.purchaseService.getAllPaymentMethods();
  }

  @Get('document-types/all')
  @Permissions('read_purchase_document_types')
  @ApiOperation({ summary: 'Get all document types for purchases' })
  @ApiResponse({ status: 200, description: 'List of document types' })
  getDocumentTypes() {
    console.log('🔎 Llamado GET /purchase/document-types/all');
    return this.purchaseService.getAllPurchaseDocumentTypes();
  }

  @Get('orders/pending')
  @Permissions('read_purchase_orders')
  @ApiOperation({ summary: 'Get all pending purchase orders' })
  @ApiResponse({ status: 200, description: 'List of pending purchase orders' })
  getPendingOrders() {
    console.log('🔎 Llamado GET /purchase/orders/pending');
    return this.purchaseService.getAllPendingOrders();
  }

  @Get('orders/pending/:id')
  @Permissions('read_purchase_orders')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Get one pending purchase order by ID' })
  @ApiResponse({ status: 200, description: 'Pending order details' })
  getPendingOrderById(@Param('id', ParseIntPipe) id: number) {
    console.log('🔎 Llamado GET /purchase/orders/pending/:id con id:', id);
    return this.purchaseService.getOnePendingOrderById(id);
  }

  @Get('suppliers/:id')
  @Permissions('read_suppliers')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Get supplier by ID' })
  @ApiResponse({ status: 200, description: 'Supplier details' })
  getSupplierById(@Param('id', ParseIntPipe) id: number) {
    console.log('🔎 Llamado GET /purchase/suppliers/:id con id:', id);
    return this.purchaseService.getOneSupplierById(id);
  }

  @Get(':id')
  @Permissions('read_purchases')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({ summary: 'Get purchase by ID' })
  @ApiResponse({ status: 200, description: 'Purchase details' })
  getPurchaseById(@Param('id', ParseIntPipe) id: number) {
    console.log('🔎 Llamado GET /purchase/:id con id:', id);
    return this.purchaseService.getPurchaseById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar el estado de la compra' })
  @ApiResponse({ status: 200, description: 'Status actualizado correctamente' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdatePurchaseStatusDto,
  ) {
    return this.purchaseService.updatePurchaseStatus(id, request);
  }

  @Patch(':id/wms')
  @ApiOperation({ summary: 'Actualizar el código WMS de la compra' })
  @ApiResponse({ status: 200, description: 'WMS actualizado correctamente' })
  async updateWms(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdatePurchaseWmsDto,
  ) {
    return this.purchaseService.updatePurchaseWms(id, request);
  }

  @Patch(':id/document')
  @ApiOperation({ summary: 'Actualizar el documento PDF de la compra' })
  @ApiResponse({ status: 200, description: 'Documento actualizado correctamente' })
  async updateDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdatePurchaseDocumentDto,
  ) {
    return this.purchaseService.updatePurchaseDocument(id, request);
  }


  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('🧾 Archivo recibido en Controller:', file);
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo.');
    }
    return this.purchaseService.saveFileToMongo(file);
  }



  @Put(':id')
  @ApiOperation({ summary: 'Actualizar datos de una compra' })
  @ApiResponse({ status: 200, description: 'Compra actualizada correctamente' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({
    type: UpdatePurchaseDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo completo de actualización de compra',
        value: {
          supplier_id: 2,
          purchase_date: '2025-06-15T10:00:00Z',
          invoice_number: 'INV-9999',
          payment_method_id: 3,
          comments: 'Actualización de prueba con todos los campos',
          document_type_id: 1,
          branch_id: 1,
          subtotal: 450,
          discount_total: 20,
          tax_total: 60,
          total_purchase: 490,
          cashier_id: 2,
          manager_id: 1,
          details: [
            {
              product_id: 1,
              quantity: 3,
              unit_price: 50,
              sub_total: 150,
              discount: 10,
              tax_amount: 20,
              total_line: 160,
            },
            {
              product_id: 2,
              quantity: 2,
              unit_price: 100,
              sub_total: 200,
              discount: 5,
              tax_amount: 30,
              total_line: 225,
            },
          ],
        },
      },
    },
  })

  async updatePurchase(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdatePurchaseDto,
  ) {
    return this.purchaseService.updatePurchase(id, request);
  }

  


 

}
