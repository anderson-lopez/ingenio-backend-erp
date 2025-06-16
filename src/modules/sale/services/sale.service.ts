import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import {
  Product,
  Category,
  Client,
  Gender,
  ClientCategory,
  MaritalStatus,
  PaymentMethod,
  ClientDocumentType,
  SaleDocumentType,
  Sale,
  Order,
  DiscountApproval,
} from '../entities/index';
import { User } from '../../../modules/authentication/entities/user.entity';
import { ClientRequestDto } from '../dto/client.request.dto';
import { v4 as uuidv4 } from 'uuid';
import {
  SaleAuthorizeDiscountDto,
  SaleRequestDto,
  ValidateMasterPassword,
} from '../dto/sale.request.dto';
import { InventoryHelperProvider } from 'src/modules/inventory/providers/InventoryHelperProvider.provider';
import * as bcrypt from 'bcrypt';
import { SaleProvider } from '../providers/sale.provider';
import { InventoryDictionary } from 'src/modules/inventory/dictionary/inventory.dictionary';
import { SaleStatus } from '../entities/Products/SaleStatus.entity';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Gender)
    private genderRepository: Repository<Gender>,
    @InjectRepository(ClientCategory)
    private clientCategoryRepository: Repository<ClientCategory>,
    @InjectRepository(MaritalStatus)
    private maritalStatusRepository: Repository<MaritalStatus>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(ClientDocumentType)
    private clientDocumentTypeRepository: Repository<ClientDocumentType>,
    @InjectRepository(SaleDocumentType)
    private saleDocumentTypeRepository: Repository<SaleDocumentType>,
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly inventoryHelperProvider: InventoryHelperProvider,
    @InjectRepository(DiscountApproval)
    private discountApprovalRepository: Repository<DiscountApproval>,
    private readonly saleProvider: SaleProvider,
    @InjectRepository(SaleStatus)
    private saleStatusRepository: Repository<SaleStatus>

  ) { }

  async getAllProducts() {
    const data = await this.productRepository.find({
      relations: [
        'subCategory',
        'subCategory.category',
        'brand',
        'typeProduct',
        'unitMeasure',
        'productImages',
        'productInventory',
        'productInventory.warehouseBranch',
        'productInventory.warehouseBranch.warehouse',
        'productInventory.warehouseBranch.branch',
      ],
    });

    if (!data.length) {
      throw new NotFoundException('data not found');
    }
    const response = data.map((product) => {
      return {
        ...product,
        availabilityProduct:
          this.inventoryHelperProvider.productAvailableStatus(
            product.productInventory,
          ),
        productImages: product.productImages.map((image) => {
          return {
            ...image,
            publicImageUrl: `http://${process.env.HOST_SERVER}:${process.env.PORT}${process.env.BASE_PATH}/mongo-file-storage/${image.productImageMongoId}?bucketName=${image.mongoBucketName || process.env.MONGO_GRIDFS_BUCKET_NAME}`,
          };
        }),
      };
    });

    return response;
  }

  public async getOneProductById(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: [
        'subCategory',
        'subCategory.category',
        'brand',
        'typeProduct',
        'unitMeasure',
        'productImages',
        'productInventory',
        'productInventory.warehouseBranch',
        'productInventory.warehouseBranch.warehouse',
        'productInventory.warehouseBranch.branch',
      ],
    });

    if (!product) {
      throw new NotFoundException('data not found');
    }

    const response = {
      ...product,
      availabilityProduct: this.inventoryHelperProvider.productAvailableStatus(
        product.productInventory,
      ),
      productImages: product.productImages.map((image) => {
        return {
          ...image,
          publicImageUrl: `http://${process.env.HOST_SERVER}:${process.env.PORT}${process.env.BASE_PATH}/mongo-file-storage/${image.productImageMongoId}?bucketName=${image.mongoBucketName || process.env.MONGO_GRIDFS_BUCKET_NAME}`,
        };
      }),
    };

    return response;
  }

  public async getOneProductByBarCode(barcode: string) {
    const product = await this.productRepository.findOne({
      where: { barCodeNumber: barcode },
      relations: [
        'subCategory',
        'subCategory.category',
        'brand',
        'typeProduct',
        'unitMeasure',
        'productImages',
        'productInventory',
        'productInventory.warehouseBranch',
        'productInventory.warehouseBranch.warehouse',
        'productInventory.warehouseBranch.branch',
      ],
    });

    if (!product) {
      throw new NotFoundException('data not found');
    }

    const response = {
      ...product,
      availabilityProduct: this.inventoryHelperProvider.productAvailableStatus(
        product.productInventory,
      ),
      productImages: product.productImages.map((image) => {
        return {
          ...image,
          publicImageUrl: `http://${process.env.HOST_SERVER}:${process.env.PORT}${process.env.BASE_PATH}/mongo-file-storage/${image.productImageMongoId}?bucketName=${image.mongoBucketName || process.env.MONGO_GRIDFS_BUCKET_NAME}`,
        };
      }),
    };

    return response;
  }

  async getAllCategories() {
    const data = await this.categoryRepository.find({
      relations: ['subCategories'],
    });
    if (!data.length) {
      throw new NotFoundException('data not found');
    }
    return data;
  }

  async getSaleStatuses() {
    const data = await this.saleStatusRepository.find();
  
    if (!data.length) {
      throw new NotFoundException('No sale statuses found');
    }
  
    return data;
  }
  

  async getAllClients() {
    const data = await this.clientRepository.find();
    if (!data.length) {
      throw new NotFoundException('data not found');
    }
    return data;
  }

  async getOneClientById(id: number) {
    const data = await this.clientRepository.findOne({
      where: { id },
      relations: ['clientPoints', 'clientCategory'],
    });
    if (!data) {
      throw new NotFoundException('data not found');
    }
    return data;
  }

  async getClientsByFullName(fullName: string) {
    const searchTerm = fullName.toLowerCase();

    const data = await this.clientRepository.find();

    const filteredClients = data.filter((client) =>
      `${client.firstName} ${client.lastName}`
        .toLowerCase()
        .includes(searchTerm),
    );

    return filteredClients;
  }

  async getGenders() {
    const data = await this.genderRepository.find();
    if (!data.length) {
      throw new NotFoundException('data not found');
    }
    return data;
  }

  async getClientCategories() {
    const data = await this.clientCategoryRepository.find();
    if (!data.length) {
      throw new NotFoundException('data not found');
    }
    return data;
  }

  async getMaritalStatus() {
    const data = await this.maritalStatusRepository.find();
    if (!data.length) {
      throw new NotFoundException('data not found');
    }
    return data;
  }

  async createClient(client: ClientRequestDto) {
    const clientUUID = uuidv4().toUpperCase(); // Genera un UUID válido en mayúsculas

    const clients = await this.clientRepository.find();

    // validar si existe por email o por dui
    const clientExist = clients.find(
      (c) => c.email === client.email || c.duiNumber === client.dui_number,
    );

    if (clientExist) {
      throw new NotFoundException(
        'El cliente ya se encuentra registrado con el Email o DUI ingresado',
      );
    }
    const newClient = this.clientRepository.create({
      ...client,
      firstName: client.first_name,
      lastName: client.last_name,
      birthDate: client.birth_date,
      genderId: client.gender_id,
      maritalStatusId: client.marital_status_id,
      duiNumber: client.dui_number,
      nitNumber: client.nit_number,
      mobileNumber: client.mobile_number,
      officeNumber: client.office_number,
      faxNumber: client.fax_number,
      fullAddress: client.full_address,
      postalCode: client.postal_code,
      companyName: client.company_name,
      companyNit: client.company_nit,
      companyAddress: client.company_address,
      clientCategoryId: client.client_category_id,
      codeClient: clientUUID,
      startDate: client.start_date,
      endDate: client.end_date,
      companyNumber: client.company_number,
      branchId: client.branch_id,
      documentTypeId: client.document_type_id,
      departmentId: client.department_id,
      municipalityId: client.municipality_id,
      districtId: client.district_id,
      street: client.street,
      clientType: client.client_type,
      ncrNumber: client.ncr_number,
      economicActivityId: client.economic_activity_id,
      
    });
    const data = this.clientRepository.save(newClient);

    return data;
  }

  async getAllPaymentMethods() {
    const data = await this.paymentMethodRepository.find();
    if (!data.length) {
      throw new NotFoundException('data not found');
    }
    return data;
  }

  async getAllClientDocumentTypes() {
    const data = await this.clientDocumentTypeRepository.find();
    if (!data.length) {
      throw new NotFoundException('data not found');
    }
    return data;
  }

  async getAllSaleDocumentTypes() {
    const data = await this.saleDocumentTypeRepository.find();
    if (!data.length) {
      throw new NotFoundException('data not found');
    }
    return data;
  }

  async createSale(request: SaleRequestDto) {
    console.log('🛒 Iniciando creación de venta');
  
    if (!(request.order_id || request.order_id == 0)) {
      for (const detail of request.details) {
        console.log(`🔍 Verificando stock del producto ID ${detail.product_id}`);
        await this.saleProvider.verifyProductStock(
          detail.product_id,
          request.branch_id,
          detail.quantity,
        );
      }
  
      console.log(`🔍 Verificando existencia del método de pago ID: ${request.payment_method_id}`);
      const paymentMethodExists = await this.paymentMethodRepository.exist({
        where: { id: request.payment_method_id },
      });
  
      if (!paymentMethodExists) {
        console.warn(`⚠️ El método de pago ID ${request.payment_method_id} no existe.`);
        return {
          success: false,
          message: `El método de pago especificado no es válido`,
        };
      }
  
      console.log('🧾 Creando objeto de venta');
      const saleObject = this.saleRepository.create({
        ...request,
        clientId: request.client_id,
        paymentMethodId: request.payment_method_id, // Usamos el ID directamente
        guestDocumentType: request.guest_document_type,
        guestDocumentNumber: request.guest_document_number,
        comments: request.comments,
        registerNumber: request.register_number,
        transferNumber: request.transfer_number,
        documentTypeSaleId: request.document_type_sale_id,
        guestEmail: request.guest_email,
        guestName: request.guest_name,
        guestPhone: request.guest_phone,
        total: request.total,
        saleStatusId: InventoryDictionary.SALE_STATUS.CREATED,
        subtotal: request.subtotal,
        totalDiscount: request.total_discount,
        totalTaxAmount: request.total_tax_amount,
        totalSale: request.total_sale,
        saleDate: new Date(),
        idUser: request.id_user, // 👈 Nuevo campo para guardar el usuario
        saleDetails: request.details.map((detail) => ({
          ...detail,
          productId: detail.product_id,
          quantity: detail.quantity,
          unitPrice: detail.unit_price,
          subTotal: detail.subTotal,
          discount: detail.discount,
          taxAmount: detail.tax_amount,
          totalLine: detail.total_line,
        })),
      });
  
      console.log('💾 Guardando venta');
      const sale = await this.saleRepository.save(saleObject);
  
      for (const detail of request.details) {
        console.log(`📦 Actualizando inventario producto ID ${detail.product_id}`);
        await this.saleProvider.updateProductInventory(
          detail.product_id,
          request.branch_id,
          detail.quantity,
        );
      }
  
      const salesDiscounts = sale.saleDetails.filter((detail) => detail.discount > 0);
  
      if (salesDiscounts.length > 0) {
        console.log(`🧮 Registrando descuentos (${salesDiscounts.length})`);
        const discountsLogs = this.discountApprovalRepository.create(
          salesDiscounts.map((sale) => {
            const item = request.details.find((d) => d.product_id === sale.productId);
            return {
              cashierId: request.cashier_id,
              managerId: request.manager_id,
              productId: item.product_id,
              saleId: sale.saleId,
              originalProductPrice: sale.unitPrice,
              discountProductPrice: sale.unitPrice - sale.discount,
              discountAmount: sale.discount,
              discountPercentage: (sale.discount / sale.unitPrice) * 100,
            };
          }),
        );
  
        await this.discountApprovalRepository.save(discountsLogs);
      }
  
      console.log('✅ Venta creada correctamente');
      return { success: true, data: sale };
    } else {
      console.log('🔄 Procesando venta a partir de orden existente');
      return this.createSaleFromOrder(request);
    }
  }
  

  async createSaleFromOrder(request: SaleRequestDto) {
    for (const detail of request.details) {
      await this.saleProvider.verifyProductStock(
        detail.product_id,
        request.branch_id,
        detail.quantity,
      );
    }

    const saleObject = this.saleRepository.create({
      ...request,
      clientId: request.client_id,
      paymentMethodId: request.payment_method_id,
      guestDocumentType: request.guest_document_type,
      guestDocumentNumber: request.guest_document_number,
      comments: request.comments,
      registerNumber: request.register_number,
      transferNumber: request.transfer_number,
      documentTypeSaleId: request.document_type_sale_id,
      guestEmail: request.guest_email,
      guestName: request.guest_name,
      guestPhone: request.guest_phone,
      total: request.total,
      orderId: request.order_id ?? null,
      subtotal: request.subtotal,
      totalDiscount: request.total_discount,
      totalTaxAmount: request.total_tax_amount,
      saleStatusId: InventoryDictionary.SALE_STATUS.FINISHED,
      totalSale: request.total_sale,
      saleDate: new Date(),
      saleDetails: request.details.map((detail) => {
        return {
          ...detail,
          productId: detail.product_id,
          quantity: detail.quantity,
          unitPrice: detail.unit_price,
          subTotal: detail.subTotal,
          discount: detail.discount,
          taxAmount: detail.tax_amount,
          totalLine: detail.total_line,
        };
      }),
    });

    const sale = await this.saleRepository.save(saleObject);

    for (const detail of request.details) {
      await this.saleProvider.updateProductInventory(
        detail.product_id,
        request.branch_id,
        detail.quantity,
      );
    }
    const salesDiscounts = sale.saleDetails.filter(
      (detail) => detail.discount > 0,
    );

    const discountsLogs = this.discountApprovalRepository.create(
      salesDiscounts.map((sale) => {
        const item = request.details.filter(
          (detail) => detail.product_id === sale.productId,
        )[0];
        return {
          cashierId: request.cashier_id,
          managerId: request.manager_id,
          productId: item.product_id,
          saleId: sale.saleId,
          originalProductPrice: sale.unitPrice,
          discountProductPrice: sale.unitPrice - sale.discount,
          discountAmount: sale.discount,
          discountPercentage: (sale.discount / sale.unitPrice) * 100,
        };
      }),
    );

    await this.discountApprovalRepository.save(discountsLogs);

    // updating status of order
    const order = await this.orderRepository.findOneBy({ id: request.order_id });
    order.orderStatusId = InventoryDictionary.ORDER_STATUS.SALE_CREATED;
    await this.orderRepository.save(order);

    return sale;
  }

  async getAllSales() {
    const data = await this.saleRepository.find({ relations: ['saleDetails'] });
    if (!data.length) {
      throw new NotFoundException('data not found');
    }
    return data;
  }

  async getAllSalesByClientId(clientId: number) {
    const data = await this.saleRepository.find({
      where: {
        clientId,
      },
    });

    if (!data.length) {
      throw new NotFoundException('data not foun');
    }

    return data;
  }

  async getAllOrdersPending() {
    const data = await this.orderRepository.find({
      where: {
        orderStatusId: 1,
        paymentMethodId: Not(1)
      },
      relations: [
        'orderStatus',
        'pickupBranch',
        'client',
        'orderDetails',
        'orderDetails.product',
        'client.clientCategory',
      ],
    });

    console.log(data.length);

    if (!data.length) {
      throw new NotFoundException('Orders pending not found');
    }

    return data;
  }

  async getOneOrderPending(orderId: number) {
    const data = await this.orderRepository.findOne({
      where: {
        id: orderId,
        orderStatusId: 1,
      },
      relations: [
        'orderStatus',
        'pickupBranch',
        'client',
        'orderDetails',
        'orderDetails.product',
        'client.clientCategory',
        'documentTypeSale',
      ],
    });

    if (!data) {
      throw new NotFoundException('Order not found');
    }

    return data;
  }

  async authorizeProducDiscount(request: SaleAuthorizeDiscountDto) {
    const product = await this.productRepository.findOne({
      where: { id: request.product_id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const manager = await this.userRepository.findOne({
      where: { id: request.manager_id },
    });

    if (!manager) {
      throw new NotFoundException('Manager not found');
    }

    const validPassword = await bcrypt.compare(
      request.manager_password,
      manager.masterPassword,
    );

    if (!validPassword) {
      throw new NotFoundException('Invalid Password for Manager Authorization');
    }

    const totalDiscount = request.discount_percentage
      ? product.salePrice * (request.discount_percentage / 100)
      : request.discount_value;

    if (totalDiscount > product.salePrice) {
      throw new NotFoundException(
        'Discount value is greater than product sale price',
      );
    }

    return {
      ...product,
      totalDiscountAproved: totalDiscount,
    };
  }

  async validateMasterPassword(request: ValidateMasterPassword) {
    const manager = await this.userRepository.findOne({
      where: { id: request.manager_id },
    });

    if (!manager) {
      throw new NotFoundException('Gerente no encontrado para la validacion de contraseña');
    }

    const validPassword = await bcrypt.compare(
      request.manager_password,
      manager.masterPassword,
    );

    if (!validPassword) {
      throw new NotFoundException('Contraseña maestra de gerente invalida para la autorizacion de descuento del producto');
    }

    return {
      message: 'Contraseña maestra de gerente valida para la autorizacion de descuento del producto',
      status: true,
    }
  }
}
