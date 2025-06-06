import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Product,
  Supplier,
  PaymentMethod,
  Purchase,
  PurchaseDetail,
  PurchaseDocumentType,
  DiscountApproval,
} from '../entities/index';
import {
  PurchaseRequestDto,
  PurchaseAuthorizeDiscountDto,
  ValidateMasterPassword,
} from '../dto/purchase.request.dto';
import { SupplierRequestDto } from '../dto/supplier.request.dto'; // si lo tienes en tu estructura
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/authentication/entities/user.entity';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    @InjectRepository(PurchaseDetail)
    private purchaseDetailRepository: Repository<PurchaseDetail>,
    @InjectRepository(PurchaseDocumentType)
    private purchaseDocumentTypeRepository: Repository<PurchaseDocumentType>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DiscountApproval)
    private discountApprovalRepository: Repository<DiscountApproval>,
  ) {}

  async createPurchase(request: PurchaseRequestDto) {
    const purchaseObject = this.purchaseRepository.create({
      ...request,
      supplier: { id: request.supplier_id },
      paymentMethodId: request.payment_method_id,
      documentTypeId: request.document_type_id,
      branchId: request.branch_id,
      totalPurchase: request.total_purchase,
      PurchaseDate: new Date(request.purchase_date), // 🔥 Usa la misma mayúscula
      PurchaseDetails: request.details.map((detail) => ({
        productId: detail.product_id,
        quantity: detail.quantity,
        unitPrice: detail.unit_price,
        subTotal: detail.sub_total,
        discount: detail.discount,
        taxAmount: detail.tax_amount,
        totalLine: detail.total_line,
      })),
    });
    
  
    return this.purchaseRepository.save(purchaseObject);
  }
  


  async getAllPurchases() {
    console.log('✅ Llegó al método getAllPurchases');
  
    try {
      const data = await this.purchaseRepository.find({
        relations: ['PurchaseDetails', 'supplier'],
      });
      console.log('✅ Data encontrada:', data);
  
      if (!data.length) throw new NotFoundException('Purchases not found');
  
      return data;
    } catch (error) {
      console.error('❌ Error en getAllPurchases:', error);
      throw error;
    }
  }
  

  async getPurchaseById(id: number) {
    const purchase = await this.purchaseRepository.findOne({
      where: { id },
      relations: ['purchaseDetails', 'supplier'],
    });
    if (!purchase) throw new NotFoundException('Purchase not found');
    return purchase;
  }

  async authorizeProductDiscount(request: PurchaseAuthorizeDiscountDto) {
    const product = await this.productRepository.findOne({
      where: { id: request.product_id },
    });
    if (!product) throw new NotFoundException('Product not found');

    const manager = await this.userRepository.findOne({
      where: { id: request.manager_id },
    });
    if (!manager) throw new NotFoundException('Manager not found');

    const validPassword = await bcrypt.compare(
      request.manager_password,
      manager.masterPassword,
    );
    if (!validPassword)
      throw new NotFoundException('Invalid manager password');

    const totalDiscount = request.discount_percentage
      ? product.PurchasePrice * (request.discount_percentage / 100)
      : request.discount_value;

    if (totalDiscount > product.PurchasePrice) {
      throw new NotFoundException('Discount exceeds product price');
    }

    return { ...product, totalDiscountApproved: totalDiscount };
  }

  async validateManagerPassword(request: ValidateMasterPassword) {
    const manager = await this.userRepository.findOne({
      where: { id: request.manager_id },
    });
    if (!manager) throw new NotFoundException('Manager not found');

    const validPassword = await bcrypt.compare(
      request.manager_password,
      manager.masterPassword,
    );
    if (!validPassword)
      throw new NotFoundException('Invalid manager password');

    return { message: 'Manager password is valid', status: true };
  }

  async getAllSuppliers() {
    const data = await this.supplierRepository.find();
    if (!data.length) throw new NotFoundException('Suppliers not found');
    return data;
  }

  async getOneSupplierById(id: number) {
    const supplier = await this.supplierRepository.findOne({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  // 🔧 Ajuste aquí: el método recibe el DTO, no la entidad
  async createSupplier(supplierDto: SupplierRequestDto) {
    const newSupplier = this.supplierRepository.create({
      ...supplierDto,
    });
    return this.supplierRepository.save(newSupplier);
  }

  async getAllPaymentMethods() {
    const data = await this.paymentMethodRepository.find();
    if (!data.length) throw new NotFoundException('Payment methods not found');
    return data;
  }

  async getAllPurchaseDocumentTypes() {
    const data = await this.purchaseDocumentTypeRepository.find();
    if (!data.length) throw new NotFoundException('Document types not found');
    return data;
  }

  async getAllPendingOrders() {
    // Implementar lógica para órdenes de compra pendientes si es necesario
    return [];
  }

  async getOnePendingOrderById(orderId: number) {
    // Implementar lógica para obtener una orden de compra pendiente si es necesario
    return {};
  }
}
