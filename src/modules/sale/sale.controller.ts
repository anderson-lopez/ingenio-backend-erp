import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SaleService } from './services/sale.service';
import { Permissions } from 'src/common/security/permissions.decorator';
import { ClientRequestDto } from './dto/client.request.dto';
import {
  SaleAuthorizeDiscountDto,
  SaleRequestDto,
  ValidateMasterPassword,
} from './dto/sale.request.dto';

@ApiTags('Sales')
@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) { }
  @Permissions('read_categories')
  @Get('categories')
  getCategories() {
    return this.saleService.getAllCategories();
  }

  @Get('products')
  @Permissions('read_products')
  getProducts() {
    return this.saleService.getAllProducts();
  }

  @Get('products/:id')
  @ApiParam({ name: 'id', type: Number })
  @Permissions('read_products')
  getProductById(@Param('id') id: number) {
    return this.saleService.getOneProductById(id);
  }

  @Get('statuses')
  @Permissions('read_sale_statuses')
  @ApiOperation({ summary: 'Obtener todos los estados de venta' })
  getSaleStatuses() {
    return this.saleService.getSaleStatuses();
  }

  @Get('products/barcode/:barcode')
  @ApiParam({ name: 'barcode', type: String })
  @Permissions('read_products')
  getProductByBarcode(@Param('barcode') barcode: string) {
    return this.saleService.getOneProductByBarCode(barcode);
  }

  @Get('clients')
  @Permissions('read_clients')
  getClients() {
    return this.saleService.getAllClients();
  }

  @Get('clients/:id')
  @ApiParam({ name: 'id', type: Number })
  @Permissions('read_clients')
  getClientById(@Param('id') id: number) {
    return this.saleService.getOneClientById(id);
  }

  @Get('clients/fullname/:fullname')
  @ApiParam({ name: 'fullname', type: String })
  @Permissions('read_clients')
  getClientByFullName(@Param('fullname') fullname: string) {
    return this.saleService.getClientsByFullName(fullname);
  }

  @Get('clients/genders/all')
  @Permissions('read_genders')
  getClientGenders() {
    console.log('genders get');
    return this.saleService.getGenders();
  }

  @Get('clients/categories/all')
  @ApiOperation({
    summary: 'Get all client categories VIP, GOLDEN, DIAMANTE, SILVER',
  })

  @Permissions('read_client_categories')
  getClientCategories() {
    return this.saleService.getClientCategories();
  }

  @Get('clients/marital-status/all')
  @Permissions('read_marital_status')
  getClientMaritalStatus() {
    return this.saleService.getMaritalStatus();
  }

  @Get('clients/document-types/all')
  @Permissions('client_read_document_types')
  getClientDocumentTypes() {
    return this.saleService.getAllClientDocumentTypes();
  }

  @Post('clients')
  @Permissions('create_clients')
  createClient(@Body() client: ClientRequestDto) {
    console.log('client', client);
    return this.saleService.createClient(client);
  }

  @Get('payment/payment-methods')
  @Permissions('read_payment_methods')
  getClientPaymentMethods() {
    return this.saleService.getAllPaymentMethods();
  }

  @Get('document-types/all')
  @Permissions('sale_read_document_types')
  getClientPaymentDocumentTypes() {
    return this.saleService.getAllSaleDocumentTypes();
  }

  @Post()
  @Permissions('create_sales')
  createSale(@Body() sale: SaleRequestDto) {
    return this.saleService.createSale(sale);
  }

  @Get()
  @Permissions('read_sales')
  getSales() {
    return this.saleService.getAllSales();
  }

  @Get('/client/:client_id')
  @ApiParam({ name: 'client_id', type: Number })
  @Permissions('read_sales')
  getSalesByClientId(@Param('client_id') clientId: number) {
    return this.saleService.getAllSalesByClientId(clientId);
  }

  @Get('/orders/pending')
  @ApiOperation({
    summary: 'Get all pending orders information for create sale',
  })
  @Permissions('read_orders')
  getPendingOrders() {
    return this.saleService.getAllOrdersPending();
  }

  @Get('/orders/pending/:id')
  @ApiOperation({
    summary: 'Get one pending order information for create sale',
  })
  @ApiParam({ name: 'id', type: Number })
  @Permissions('read_orders')
  getPendingOrderById(@Param('id') id: number) {
    return this.saleService.getOneOrderPending(id);
  }

  @Post('product/authorize_discount')
  @ApiOperation({
    summary: 'Authorize Discount with password manager for specific product',
  })
  @Permissions('authorize_discount')
  authorizeDiscount(@Body() request: SaleAuthorizeDiscountDto) {
    return this.saleService.authorizeProducDiscount(request);
  }

  @Post('product/validate_manager_password')
  @ApiOperation({
    summary: 'Authorize Discount with password manager for specific product',
  })
  @Permissions('product/validate_manager_password')
  validatePassword(@Body() request: ValidateMasterPassword) {
    return this.saleService.validateMasterPassword(request);
  }
}
