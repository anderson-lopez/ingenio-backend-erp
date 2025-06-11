import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  ProductInventory,
  WarehouseBranch,
  Warehouse,
  Branch,
  ProductRefill,
  RackZone,
  LevelZone,
  ProductRotation,
  Department,
  Municipality,
  District,
} from '../entities/index';
import { Product, ProductImages } from '../../sale/entities/index';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { InventoryHelperProvider } from '../providers/InventoryHelperProvider.provider';
import {
  CreateProductDto,
  CreateProductImageDto,
  CreateProductInventoryDto,
  UpdateProductDto,
  UpdateProductInventoryNewDto,
} from '../dto/product.dto';
import { InventoryDictionary } from '../dictionary/inventory.dictionary';
import { MongoFileStorageService } from 'src/modules/mongo-file-storage/services/mongo-file-storage.service';
import { CreateProductRefillDto } from '../dto/productRefill.dto';
@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(ProductInventory)
    private productInventoryRepository: Repository<ProductInventory>,
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(WarehouseBranch)
    private warehouseBranchRepository: Repository<WarehouseBranch>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(ProductRefill)
    private productRefillRepository: Repository<ProductRefill>,
    @InjectRepository(ProductImages)
    private productImagesRepository: Repository<ProductImages>,
    private inventoryProvider: InventoryHelperProvider,
    @InjectRepository(RackZone)
    private rackZoneRepository: Repository<RackZone>,
    @InjectRepository(LevelZone)
    private levelZoneRepository: Repository<LevelZone>,
    @InjectRepository(ProductRotation)
    private productRotationRepository: Repository<ProductRotation>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Municipality)
    private municipalityRepository: Repository<Municipality>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    private mongoFileStorageService: MongoFileStorageService,
  ) { }

  async findProductsByBranch(branchId: number) {
    const data = await this.productRepository.find({
      take: 2,
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
      where: {
        productInventory: {
          warehouseBranch: {
            branch: {
              id: branchId,
            },
          },
        },
      },
    });

    if (!data.length) {
      throw new NotFoundException('Products not found at this branch');
    }

    return data;
  }

  async getInventorySummaryByBranch(): Promise<any[]> {
    const query = this.productInventoryRepository
      .createQueryBuilder('i') // Alias para ProductInventory
      .innerJoin('i.warehouseBranch', 'w') // Usa la relación warehouseBranch
      .innerJoin('w.warehouse', 'wa') // Usa la relación warehouse
      .innerJoin('w.branch', 'b') // Usa la relación branch
      .select([
        'SUM(i.monthlySalesAvg) AS total_sales_month',
        'SUM(i.currentStock) AS total_stock',
        'b.id AS branch_id',
        'b.name AS branch_name',
      ])
      .groupBy('b.id')
      .addGroupBy('b.name');

    const data = await query.getRawMany();
    const response = data.map((item) => {
      const reaminingTimeMonth = item.total_stock / item.total_sales_month;
      const reaminingTimeWeeks =
        this.inventoryProvider.convertMonthToWeeks(reaminingTimeMonth);
      // const reaminingTimeWeeks = this.inventorinyProvider.convertMonthToWeeks(reaminingTimeMonth);
      const remainingTimeText =
        reaminingTimeMonth > 1
          ? `${reaminingTimeMonth.toFixed(2)} MESES`
          : `${reaminingTimeWeeks.toFixed(2)} SEMANAS`;
      return {
        ...item,
        remainingTime: remainingTimeText,
      };
    });

    return response;
  }

  async getInventorySummaryBranchByProduct(productId: number) {
    const query = this.productInventoryRepository
      .createQueryBuilder('i') // Alias para ProductInventory
      .innerJoin('i.warehouseBranch', 'w') // Usa la relación warehouseBranch
      .innerJoin('w.warehouse', 'wa') // Usa la relación warehouse
      .innerJoin('w.branch', 'b') // Usa la relación branch
      .select([
        'i.product_id',
        'i.current_stock',
        'b.id AS branch_id',
        'b.name AS branch_name',
      ])
      .where('i.product_id = :productId', { productId });

    const data = await query.getRawMany();

    const totalStock = data.reduce((acc, item) => acc + item.current_stock, 0);

    const response = data.map((item) => {
      const percentage = (item.current_stock * 100) / totalStock;
      return {
        ...item,
        precentage: percentage,
      };
    });
    return response;
  }

  async getBranchs() {
    const data = this.branchRepository.find();
    if (!data) {
      throw new NotFoundException('Branchs not found');
    }
    return data;
  }

  async getProductInventoryByBranchAndProduct(
    branchId: number,
    productId: number,
  ) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
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
      throw new NotFoundException('Product not found');
    }
    const warehouseBranch = await this.warehouseBranchRepository.findOne({
      where: {
        branch: {
          id: branchId,
        },
      },
      relations: ['warehouse', 'branch'],
    });
    if (!warehouseBranch) {
      throw new NotFoundException('Warehouse-branch not found');
    }

    const data = await this.productRepository.findOne({
      where: {
        productInventory: {
          warehouseBranchId: warehouseBranch.id,
          productId: productId,
        },
      },
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
        'productInventory.productRepositionFrecuencyEntity',
        'productInventory.productRotationEntity',
        'productInventory.rackZone',
        'productInventory.levelZone',
        'productInventory.alternativeRackZone',
        'productInventory.alternativeLevelZone',
      ],
    });


    if (!data) {
      throw new NotFoundException('Product inventory not found at this branch');
    }

    // const response = data.productInventory.map((item) => {
    //   const formatWithSlash = (a?: string, b?: string) =>
    //     a && b ? `${a} / ${b}` : a || b || '';

    //   return {
    //     warehouse_zone: formatWithSlash(item.warehouseZoneLocation, item.productRotationEntity?.description),
    //     racks_and_levels: formatWithSlash(item.rackZone?.name, item.levelZone?.name),
    //     bin_location: item.bin || '',
    //     product_bar_code: product.barCodeNumber || '',
    //     alternative_location: formatWithSlash(
    //       item.alternativeZoneLocation,
    //       formatWithSlash(item.alternativeRackZone?.name, item.alternativeLevelZone?.name)
    //     ),
    //     stock_life_cycle_days: item.stockLifeCycleDays ? `${item.stockLifeCycleDays} dias en promedio` : '',
    //     fifo_or_fefo: item.isFifo ? 'FIFO' : 'FEFO',
    //     average_picking_minutes: item.averagePickingMinutes ? `${item.averagePickingMinutes} minutos por unidad` : '',
    //     rotation_frecuency: item.productRotationEntity?.name || '',
    //   };
    // });

    // {
    //   "product_rotation_id": 0,
    //   "warehouse_zone_location": "string",
    //   "rack_zone_id": 0,
    //   "level_zone_id": 0,
    //   "bin": "string",
    //   "alternative_zone_location": "string",
    //   "alternative_level_zone_id": 0,
    //   "alternative_rack_zone_id": 0,
    //   "stock_life_cycle_days": 0,
    //   "is_fifo": true,
    //   "is_fefo": true,
    //   "average_picking_minutes": 0,
    //   "product_id": 0,
    //   "branch_id": 0
    // }

    const wmsProduct = data.productInventory[0];
    const response = {
      product_rotation_id: wmsProduct.productRotation,
      warehouse_zone_location: wmsProduct.warehouseZoneLocation,
      rack_zone_id: wmsProduct.rackZoneId,
      level_zone_id: wmsProduct.levelZoneId,
      bin: wmsProduct.bin,
      alternative_zone_location: wmsProduct.alternativeZoneLocation,
      alternative_level_zone_id: wmsProduct.alternativeLevelZoneId,
      alternative_rack_zone_id: wmsProduct.alternativeRackZoneId,
      stock_life_cycle_days: wmsProduct.stockLifeCycleDays,
      is_fifo: wmsProduct.isFifo,
      is_fefo: wmsProduct.isFefo,
      average_picking_minutes: wmsProduct.averagePickingMinutes,
      product_id: wmsProduct.productId,
      branch_id: wmsProduct.warehouseBranchId,

    }

    return response;
  }

  async getProductRefillHistory(productId: number) {
    console.log('productId', productId);
    const data = await this.productRefillRepository.find({
      where: {
        productId,
      },
      relations: [
        'productRefillStatus',
        'product',
        'originWarehouseBranch',
        'destinyWarehouseBranch',
        'destinyWarehouseBranch.warehouse',
        'destinyWarehouseBranch.branch',
        'originWarehouseBranch.warehouse',
        'originWarehouseBranch.branch',
      ],
    });

    console.log('data', data);

    if (!data.length) {
      throw new NotFoundException('Product refill history not found');
    }

    const response = data.map((item) => {
      return {
        id: item.id,
        quantity: item.quantity,
        // created at formtat dd/mm/yyyy
        createdAt: item.createdAt.toLocaleDateString('es-SV', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
        productId: item.productId,
        productRefillStatusId: item.productRefillStatusId,
        originBranchId: item.originWarehouseBranch.branch.id,
        destinyBranchId: item.destinyWarehouseBranch.branch.id,
        originBranchName: item.originWarehouseBranch.branch.name,
        destinyBranchName: item.destinyWarehouseBranch.branch.name,
        productRefillStatus: item.productRefillStatus.description,
      };
    }
    );

    return response;
  }

  async createProduct(request: CreateProductDto) {
    console.log('🌟 Iniciando creación de producto con DTO:', JSON.stringify(request, null, 2));
  
    // Verificar si el producto ya existe
    console.log('🔍 Buscando producto existente con internal_code:', request.general_information.internal_code);
    const productExist = await this.productRepository.findOne({
      where: {
        internal_code: request.general_information.internal_code,
      },
    });
  
    if (productExist) {
      console.error('❌ Producto ya existe con este internal_code.');
      throw new NotFoundException('Product already exist with this Internal Code');
    }
    console.log('✅ No existe producto con ese internal_code, continuamos...');
  
    // Crear datos del producto
    console.log('📝 Creando objeto del producto...');
    const data = this.productRepository.create({
      name: request.general_information.name,
      skuCode: request.general_information.sku_code,
      subcategoryId: request.general_information.subcategory_id,
      salePrice: request.general_information.sale_price,
      expireDate: (request.general_information.expire_date == "" || request.general_information.expire_date == null) ? null : request.general_information.expire_date,
      internal_code: request.general_information.internal_code,
      weightKg: request.general_information.weight_kg,
      lengthCm: request.general_information.length_cm,
      widthCm: request.general_information.width_cm,
      heightCm: request.general_information.height_cm,
      unitsPerBox: request.general_information.units_per_box,
      warehouseCost: request.general_information.warehouse_cost,
      offerPrice: request.general_information.offer_price,
      providerNumber: request.general_information.provider_number,
      sanSalvadorLocation: request.general_information.location_san_salvador,
    });
  
    console.log('💾 Guardando producto en la base de datos...');
    const product = await this.productRepository.save(data);
    console.log('✅ Producto guardado con ID:', product.id);
  
    // Buscar la sucursal del almacén
    console.log('🔍 Buscando WarehouseBranch para la BODEGA_CENTRAL...');
    const warehouseBranch = await this.warehouseBranchRepository.findOne({
      where: {
        warehouse: {
          id: InventoryDictionary.WAREHOUSES.BODEGA_CENTRAL,
        },
      },
    });
    console.log('✅ WarehouseBranch encontrado:', warehouseBranch);
  
    // Crear inventario del producto
    console.log('📝 Creando objeto ProductInventory...');
    const productInventory = this.productInventoryRepository.create({
      productRotation: request.wms_information.product_rotation_id,
      rackZoneId: request.wms_information.rack_zone_id,
      levelZoneId: request.wms_information.level_zone_id,
      bin: request.wms_information.bin,
      alternativeRackZoneId: request.wms_information.alternative_rack_zone_id,
      alternativeLevelZoneId: request.wms_information.alternative_level_zone_id,
      stockLifeCycleDays: request.wms_information.stock_life_cycle_days,
      isFefo: request.wms_information.is_fefo,
      isFifo: request.wms_information.is_fifo,
      averagePickingMinutes: request.wms_information.average_picking_minutes,
      productId: product.id,
      warehouseBranchId: warehouseBranch.id,
      minStock: request.general_information.quantity,
      maxStock: request.general_information.quantity + (request.general_information.quantity * 0.5),
      currentStock: request.general_information.quantity,
      warehouseZoneLocation: request.wms_information.warehouse_zone_location,
      alternativeZoneLocation: request.wms_information.alternative_zone_location,
    });
  
    console.log('💾 Guardando ProductInventory en la base de datos...');
    const productInventoryCreated = await this.productInventoryRepository.save(productInventory);
    console.log('✅ ProductInventory creado con ID:', productInventoryCreated.id);
  
    // Crear imágenes del producto
    console.log('📝 Creando ProductImages...');
    const productImage = this.productImagesRepository.create(
      request.product_images.map((item) => ({
        productImageMongoId: item.product_image_mongo_id,
        isCover: item.is_cover,
        isGallery: item.is_gallery,
        isBarcode: item.is_barcode,
        productId: product.id,
        mongoBucketName: item.mongo_bucket_name,
      })),
    );
  
    console.log('💾 Guardando ProductImages...');
    const productImagesSaved = await this.productImagesRepository.save(productImage);
    console.log('✅ ProductImages guardadas:', productImagesSaved.length);
  
    // Buscar producto completo con relaciones
    console.log('🔍 Buscando producto completo con relaciones...');
    const dataProduct = await this.productRepository.findOne({
      where: {
        productInventory: {
          productId: product.id,
        },
      },
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
        'productInventory.productRepositionFrecuencyEntity',
        'productInventory.productRotationEntity',
        'productInventory.rackZone',
        'productInventory.levelZone',
        'productInventory.alternativeRackZone',
        'productInventory.alternativeLevelZone',
      ],
    });
  
    console.log('🎉 Proceso de creación finalizado. Producto:', JSON.stringify(dataProduct, null, 2));
    return dataProduct;
  }
  

  async updateProduct(request: UpdateProductDto) {
    console.log('🔄 Iniciando actualización del producto:', request.general_information.product_id);
  
    const product = await this.productRepository.findOne({
      where: { id: request.general_information.product_id },
    });
    console.log('🔍 Producto encontrado:', product);
  
    if (!product) {
      console.error('❌ Producto no encontrado');
      throw new NotFoundException('Product not found');
    }
  
    console.log('✏️ Actualizando campos básicos del producto...');
    product.name = request.general_information.name || product.name;
    product.skuCode = request.general_information.sku_code || product.skuCode;
    product.subcategoryId = request.general_information.subcategory_id || product.subcategoryId;
    product.salePrice = request.general_information.sale_price || product.salePrice;
    const expireDate = (request.general_information.expire_date == "" || request.general_information.expire_date == null)
      ? null
      : request.general_information.expire_date;
    product.expireDate = expireDate ? new Date(expireDate) : product.expireDate;
    product.weightKg = request.general_information.weight_kg || product.weightKg;
    product.lengthCm = request.general_information.length_cm || product.lengthCm;
    product.widthCm = request.general_information.width_cm || product.widthCm;
    product.heightCm = request.general_information.height_cm || product.heightCm;
    product.unitsPerBox = request.general_information.units_per_box || product.unitsPerBox;
    product.warehouseCost = request.general_information.warehouse_cost || product.warehouseCost;
    product.offerPrice = request.general_information.offer_price || product.offerPrice;
    product.providerNumber = request.general_information.provider_number || product.providerNumber;
    product.sanSalvadorLocation = request.general_information.location_san_salvador || product.sanSalvadorLocation;
  
    console.log('🖼️ Obteniendo imágenes actuales del producto...');
    const currentProductImages = await this.productImagesRepository.find({
      where: { productId: product.id },
    });
    console.log('🖼️ Imágenes actuales:', currentProductImages);
  
    const requestImagesQr = request.product_images.filter((item) => item.is_barcode === true);
    const requestImagesCover = request.product_images.filter((item) => item.is_cover === true);
    console.log('📸 Imágenes QR encontradas en request:', requestImagesQr);
    console.log('📸 Imágenes Cover encontradas en request:', requestImagesCover);
  
    if (requestImagesQr.length > 0) {
      console.log('🔄 Actualizando imagen QR...');
      const qrImage = requestImagesQr[0];
  
      if (!this.inventoryProvider.isUrl(qrImage.product_image)) {
        console.log('🗑️ Eliminando QR actual (no es URL)');
        for (const item of currentProductImages) {
          if (item.isBarcode) {
            const bucketName = (item.mongoBucketName == null || item.mongoBucketName == "")
              ? process.env.MONGO_GRIDFS_BUCKET_NAME
              : item.mongoBucketName;
            if (item.productImageMongoId) {
              try {
                console.log(`🗑️ Eliminando archivo Mongo: ${item.productImageMongoId} del bucket: ${bucketName}`);
                await this.mongoFileStorageService.deleteFile(item.productImageMongoId, bucketName);
              } catch (error) {
                console.error(`⚠️ Error eliminando archivo Mongo: ${error.message}`);
              }
            } else {
              console.warn(`⚠️ No hay productImageMongoId para el producto ID: ${product.id}, saltando...`);
            }
            item.productImageMongoId = qrImage.product_image;
            item.mongoBucketName = qrImage.mongo_bucket_name;
          }
        }
  
        const currentQrImage = currentProductImages.find((item) => item.isBarcode);
        if (!currentQrImage) {
          console.log('🆕 Creando nueva imagen QR en BD');
          const newQrImage = this.productImagesRepository.create({
            productImageMongoId: qrImage.product_image,
            isCover: false,
            isGallery: false,
            isBarcode: true,
            productId: product.id,
            mongoBucketName: qrImage.mongo_bucket_name,
          });
          currentProductImages.push(newQrImage);
        }
      }
    }
  
    if (requestImagesCover.length > 0) {
      console.log('🔄 Actualizando imagen Cover...');
      const coverImage = requestImagesCover[0];
  
      if (!this.inventoryProvider.isUrl(coverImage.product_image)) {
        console.log('🗑️ Eliminando Cover actual (no es URL)');
        for (const item of currentProductImages) {
          if (item.isCover) {
            const bucketName = (item.mongoBucketName == null || item.mongoBucketName == "")
              ? process.env.MONGO_GRIDFS_BUCKET_NAME
              : item.mongoBucketName;
            if (item.productImageMongoId) {
              try {
                console.log(`🗑️ Eliminando archivo Mongo: ${item.productImageMongoId} del bucket: ${bucketName}`);
                await this.mongoFileStorageService.deleteFile(item.productImageMongoId, bucketName);
              } catch (error) {
                console.error(`⚠️ Error eliminando archivo Mongo: ${error.message}`);
              }
            } else {
              console.warn(`⚠️ No hay productImageMongoId para el producto ID: ${product.id}, saltando...`);
            }
            item.productImageMongoId = coverImage.product_image;
            item.mongoBucketName = coverImage.mongo_bucket_name;
          }
        }
  
        const currentCoverImage = currentProductImages.find((item) => item.isCover);
        if (!currentCoverImage) {
          console.log('🆕 Creando nueva imagen Cover en BD');
          const newCoverImage = this.productImagesRepository.create({
            productImageMongoId: coverImage.product_image,
            isCover: true,
            isGallery: false,
            isBarcode: false,
            productId: product.id,
            mongoBucketName: coverImage.mongo_bucket_name,
          });
          currentProductImages.push(newCoverImage);
        }
      }
    }
  
    console.log('💾 Guardando imágenes actualizadas en la base de datos...');
    await this.productImagesRepository.save(currentProductImages);
    console.log('✅ Imágenes actualizadas guardadas.');
  
    console.log('💾 Guardando producto actualizado en la base de datos...');
    await this.productRepository.save(product);
    console.log('✅ Producto actualizado guardado.');
  
    console.log('🔄 Recuperando producto final con relaciones...');
    const productUpdated = await this.productRepository.findOne({
      where: { id: request.general_information.product_id },
      relations: [
        'productInventory',
        'productImages',
        'productInventory.warehouseBranch',
        'productInventory.warehouseBranch.warehouse',
        'productInventory.warehouseBranch.branch',
      ],
    });
    console.log('🎉 Producto actualizado y listo para retornar:', productUpdated);
  
    return productUpdated;
  }
  

  async addProductImages(request: CreateProductImageDto[]) {
    const data = await this.productRepository.find();
    if (!data.length) {
      throw new NotFoundException('Product not found');
    }
    const isRequestCover = request.filter((item) => item.is_cover === true);
    if (isRequestCover.length > 1) {
      throw new NotFoundException('Only one cover image is allowed');
    }

    if (isRequestCover.length == 1) {
      const productImageCoverExist = await this.productImagesRepository.findOne(
        {
          where: {
            productId: isRequestCover[0].product_id,
            isCover: true,
          },
        },
      );

      if (productImageCoverExist)
        throw new NotFoundException(
          'Cover image for the product already exist',
        );
    }

    const images = this.productImagesRepository.create(
      request.map((item) => ({
        productImageMongoId: item.product_image_mongo_id,
        isCover: item.is_cover,
        productId: item.product_id,
        mongoBucketName: item.mongo_bucket_name,
      })),
    );

    const response = await this.productImagesRepository.save(images);
    return response;
  }

  async createInventoryToBranch(request: CreateProductInventoryDto[]) {
    const { product_id, branch_id } = request[0];

    const product = await this.productRepository.findOne({
      where: { id: product_id },
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
      throw new NotFoundException('Product not found');
    }
    const warehouseBranch = await this.warehouseBranchRepository.findOne({
      where: {
        branch: {
          id: branch_id,
        },
      },
      relations: ['warehouse', 'branch'],
    });
    if (!warehouseBranch) {
      throw new NotFoundException('Warehouse-branch not found');
    }

    const productInventoryExist = await this.productInventoryRepository.findOne(
      {
        where: {
          productId: product_id,
          warehouseBranch: {
            id: warehouseBranch.id,
          },
        },
      },
    );

    if (productInventoryExist) {
      throw new NotFoundException(
        'Inventory for this product already exist at this branch',
      );
    }

    const productInventory = this.productInventoryRepository.create(
      request.map((item) => ({
        productRotation: item.product_rotation_id,
        rackZoneId: item.rack_zone_id,
        levelZoneId: item.level_zone_id,
        bin: item.bin,
        alternativeRackZoneId: item.alternative_rack_zone_id,
        alternativeLevelZoneId: item.alternative_level_zone_id,
        stockLifeCycleDays: item.stock_life_cycle_days,
        isFefo: item.is_fefo,
        isFifo: item.is_fifo,
        averagePickingMinutes: item.average_picking_minutes,
        productId: item.product_id,
        warehouseBranchId: warehouseBranch.id,
        minStock: item.min_stock,
        maxStock: item.max_stock,
        currentStock: item.current_stock,
        warehouseZoneLocation: item.warehouse_zone_location,
        alternativeZoneLocation: item.alternative_zone_location,
      })),
    );

    await this.productInventoryRepository.save(productInventory);

    const data = await this.productRepository.findOne({
      where: {
        productInventory: {
          warehouseBranchId: warehouseBranch.id,
          productId: product_id,
        },
      },
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
        'productInventory.productRepositionFrecuencyEntity',
        'productInventory.productRotationEntity',
        'productInventory.rackZone',
        'productInventory.levelZone',
        'productInventory.alternativeRackZone',
        'productInventory.alternativeLevelZone',
      ],
    });

    const response = data.productInventory.map((item) => ({
      warehouse_zone: `${item.warehouseZoneLocation} / ${item.productRotationEntity.description}`,
      racks_and_levels: ` ${item.rackZone.name} /  ${item.levelZone.name}`,
      bin_location: item.bin,
      product_bar_code: product.barCodeNumber,
      alternative_location: `${item.alternativeZoneLocation} / ${item.alternativeRackZone.name} ${item.alternativeLevelZone.name}`,
      stock_life_cycle_days: `${item.stockLifeCycleDays} dias en promedio`,
      fifo_or_fefo: item.isFifo ? 'FIFO' : 'FEFO',
      average_picking_minutes: `${item.averagePickingMinutes} minutos por unidad`,
      rotation_frecuency: item.productRotationEntity.name,
    }));

    return response;
  }

  async updateInventoryToBranch(request: UpdateProductInventoryNewDto) {
    const { product_id, branch_id } = request;

    const product = await this.productRepository.findOne({
      where: { id: product_id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const warehouseBranch = await this.warehouseBranchRepository.findOne({
      where: {
        branch: {
          id: branch_id,
        },

      },
      relations: ['warehouse', 'branch'],
    });
    if (!warehouseBranch) {
      throw new NotFoundException('Warehouse-branch not found');
    }

    const currentProductInventory = await this.productInventoryRepository.findOne({
      where: {
        productId: product_id,
        warehouseBranchId: warehouseBranch.id,
      },
    });

    if (!currentProductInventory) {
      throw new NotFoundException('Product inventory not found');
    }

    // productRotation: request.wms_information.product_rotation_id,
    // rackZoneId: request.wms_information.rack_zone_id,
    // levelZoneId: request.wms_information.level_zone_id,
    // bin: request.wms_information.bin,
    // alternativeRackZoneId: request.wms_information.alternative_rack_zone_id,
    // alternativeLevelZoneId: request.wms_information.alternative_level_zone_id,
    // stockLifeCycleDays: request.wms_information.stock_life_cycle_days,
    // isFefo: request.wms_information.is_fefo,
    // isFifo: request.wms_information.is_fifo,
    // averagePickingMinutes: request.wms_information.average_picking_minutes,
    // productId: product.id,
    // warehouseBranchId: warehouseBranch.id,
    // minStock: request.general_information.quantity,
    // maxStock: request.general_information.quantity + (request.general_information.quantity * 0.5),
    // currentStock: request.general_information.quantity,
    // warehouseZoneLocation: request.wms_information.warehouse_zone_location,
    // alternativeZoneLocation: request.wms_information.alternative_zone_location,

    currentProductInventory.productRotation = request.product_rotation_id || currentProductInventory.productRotation;
    currentProductInventory.rackZoneId = request.rack_zone_id || currentProductInventory.rackZoneId;
    currentProductInventory.levelZoneId = request.level_zone_id || currentProductInventory.levelZoneId;
    currentProductInventory.bin = request.bin || currentProductInventory.bin;
    currentProductInventory.alternativeRackZoneId = request.alternative_rack_zone_id || currentProductInventory.alternativeRackZoneId;
    currentProductInventory.alternativeLevelZoneId = request.alternative_level_zone_id || currentProductInventory.alternativeLevelZoneId;
    currentProductInventory.stockLifeCycleDays = request.stock_life_cycle_days || currentProductInventory.stockLifeCycleDays;
    currentProductInventory.isFefo = request.is_fefo || currentProductInventory.isFefo;
    currentProductInventory.isFifo = request.is_fifo || currentProductInventory.isFifo;
    currentProductInventory.averagePickingMinutes = request.average_picking_minutes || currentProductInventory.averagePickingMinutes;
    currentProductInventory.productId = product.id || currentProductInventory.productId;
    currentProductInventory.warehouseBranchId = warehouseBranch.id || currentProductInventory.warehouseBranchId;

    // TO DO: Checkt correct flow when field quantity is sended on general information request
    // currentProductInventory.minStock = request.min_stock || currentProductInventory.minStock;
    // currentProductInventory.maxStock = request.max_stock || currentProductInventory.maxStock;
    // currentProductInventory.currentStock = request.current_stock || currentProductInventory.currentStock;
    currentProductInventory.warehouseZoneLocation = request.warehouse_zone_location || currentProductInventory.warehouseZoneLocation;
    currentProductInventory.alternativeZoneLocation = request.alternative_zone_location || currentProductInventory.alternativeZoneLocation;

    await this.productInventoryRepository.save(currentProductInventory);

    const data = await this.productRepository.findOne({
      where: {
        productInventory: {
          warehouseBranchId: warehouseBranch.id,
          productId: product_id,
        },
      },
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
        'productInventory.productRepositionFrecuencyEntity',
        'productInventory.productRotationEntity',
        'productInventory.rackZone',
        'productInventory.levelZone',
        'productInventory.alternativeRackZone',
        'productInventory.alternativeLevelZone',
      ],
    });

    // const response = data.productInventory.map((item) => {
    //   const formatWithSlash = (a?: string, b?: string) =>
    //     a && b ? `${a} / ${b}` : a || b || '';

    //   return {
    //     warehouse_zone: formatWithSlash(item.warehouseZoneLocation, item.productRotationEntity?.description),
    //     racks_and_levels: formatWithSlash(item.rackZone?.name, item.levelZone?.name),
    //     bin_location: item.bin || '',
    //     product_bar_code: product.barCodeNumber || '',
    //     alternative_location: formatWithSlash(
    //       item.alternativeZoneLocation,
    //       formatWithSlash(item.alternativeRackZone?.name, item.alternativeLevelZone?.name)
    //     ),
    //     stock_life_cycle_days: item.stockLifeCycleDays ? `${item.stockLifeCycleDays} dias en promedio` : '',
    //     fifo_or_fefo: item.isFifo ? 'FIFO' : 'FEFO',
    //     average_picking_minutes: item.averagePickingMinutes ? `${item.averagePickingMinutes} minutos por unidad` : '',
    //     rotation_frecuency: item.productRotationEntity?.name || '',
    //   };
    // });

    const wmsProduct = data.productInventory[0];
    const response = {
      product_rotation_id: wmsProduct.productRotation,
      warehouse_zone_location: wmsProduct.warehouseZoneLocation,
      rack_zone_id: wmsProduct.rackZoneId,
      level_zone_id: wmsProduct.levelZoneId,
      bin: wmsProduct.bin,
      alternative_zone_location: wmsProduct.alternativeZoneLocation,
      alternative_level_zone_id: wmsProduct.alternativeLevelZoneId,
      alternative_rack_zone_id: wmsProduct.alternativeRackZoneId,
      stock_life_cycle_days: wmsProduct.stockLifeCycleDays,
      is_fifo: wmsProduct.isFifo,
      is_fefo: wmsProduct.isFefo,
      average_picking_minutes: wmsProduct.averagePickingMinutes,
      product_id: wmsProduct.productId,
      branch_id: wmsProduct.warehouseBranchId,

    }

    return response;
  }

  async getProductSummary() {
    // total_products, total_products_with_some_stock, total_products_with_high_stock, total_product_withlow_stock
    const data = await this.productRepository.find({
      relations: ['productInventory'],
    });

    const products = data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        availabilityProduct: this.inventoryProvider.productAvailableStatus(
          item.productInventory,
        ),
      };
    });

    const response = {
      total_products: products.length,
      out_stock: products.filter(
        (item) =>
          item.availabilityProduct ===
          InventoryDictionary.PRODUCT_STATUS.OUT_OF_STOCK,
      ).length,
      in_stock: products.filter(
        (item) =>
          item.availabilityProduct ===
          InventoryDictionary.PRODUCT_STATUS.IN_STOCK,
      ).length,
      over_stock: products.filter(
        (item) =>
          item.availabilityProduct ===
          InventoryDictionary.PRODUCT_STATUS.OVER_STOCK,
      ).length,
      low_stock: products.filter(
        (item) =>
          item.availabilityProduct ===
          InventoryDictionary.PRODUCT_STATUS.LOW_STOCK,
      ).length,
      without_inventory: products.filter(
        (item) =>
          item.availabilityProduct ===
          InventoryDictionary.PRODUCT_STATUS.DEFAULT,
      ).length,
    };

    return response;
  }

  async getAllRackZones() {
    return await this.rackZoneRepository.find();
  }

  async getAllLevelZones() {
    return await this.levelZoneRepository.find();
  }

  async getAllProductRotations() {
    return await this.productRotationRepository.find();
  }

  async createProductRefill(
    request: CreateProductRefillDto,
  ) {
    const product = await this.productRepository.findOne({
      where: { id: request.product_id },
    });

    if (request.origin_branch_id == request.destiny_branch_id) {
      throw new BadRequestException('No se puede hacer un traspaso entre la misma sucursal');
    }

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const originWarehouseBranch = await this.warehouseBranchRepository.findOne({
      where: {
        branch: {
          id: request.origin_branch_id,
        },
      },
      relations: ['warehouse', 'branch'],
    });
    if (!originWarehouseBranch) {
      throw new NotFoundException('sucursal de origen no encontrada');
    }

    const destinyWarehouseBranch = await this.warehouseBranchRepository.findOne({
      where: {
        branch: {
          id: request.destiny_branch_id,
        },
      },
      relations: ['warehouse', 'branch'],
    });
    if (!destinyWarehouseBranch) {
      throw new NotFoundException('Sucursal de destino no encontrada');
    }

    // inventario origen
    const originWarehouseBranchInventory = await this.productInventoryRepository.findOne({
      where: {
        productId: request.product_id,
        warehouseBranchId: originWarehouseBranch.id,
      },
    });

    if (!originWarehouseBranchInventory) {
      throw new NotFoundException('No se encontro el inventario de la sucursal de origen');
    }

    // inventario destino
    const destinyWarehouseBranchInventory = await this.productInventoryRepository.findOne({
      where: {
        productId: request.product_id,
        warehouseBranchId: destinyWarehouseBranch.id,
      },
    });
    if (!destinyWarehouseBranchInventory) {
      throw new NotFoundException('No se encontro el inventario de la sucursal de destino');
    }

    // capacidad de origen no mayoy a la solicitud
    const originWarehouseBranchCapacity = await this.productInventoryRepository.findOne({
      where: {
        productId: request.product_id,
        warehouseBranchId: originWarehouseBranch.id,
        currentStock: MoreThanOrEqual(request.quantity),
      },
    });

    if (!originWarehouseBranchCapacity) {
      throw new BadRequestException('No hay suficiente stock en la sucursal de origen');
    }

    // capacidad de destino no menor a la solicitud
    const destinyWarehouseBranchCapacity = await this.productInventoryRepository.findOne({
      where: {
        productId: request.product_id,
        warehouseBranchId: destinyWarehouseBranch.id,
        maxStock: MoreThanOrEqual(request.quantity + destinyWarehouseBranchInventory.currentStock),
      },
    });

    if (!destinyWarehouseBranchCapacity) {
      throw new BadRequestException('Capacidad de stock destino no es suficiente para la solicitud');
    }

    const productRefill = this.productRefillRepository.create({
      productId: request.product_id,
      quantity: request.quantity,
      originWarehouseBranchId: originWarehouseBranch.id,
      destinyWarehouseBranchId: destinyWarehouseBranch.id,
      productRefillStatusId: InventoryDictionary.PRODUCT_REFILL_STATUS.APROVED,
    });

    // diminuir stock en bodega origen
    originWarehouseBranchInventory.currentStock = originWarehouseBranchInventory.currentStock - request.quantity;
    this.productInventoryRepository.save(originWarehouseBranchInventory);
    // aumentar stock en bodega destino
    destinyWarehouseBranchInventory.currentStock = destinyWarehouseBranchInventory.currentStock + request.quantity;
    this.productInventoryRepository.save(destinyWarehouseBranchInventory);

    const response = await this.productRefillRepository.save(productRefill);
    return response;
  }

  async getMaxStockByBranchAndProduct(
    productId: number,
    branchId: number,
  ) {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      }
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const warehouseBranch = await this.warehouseBranchRepository.findOne({
      where: {
        branch: {
          id: branchId,
        },
      },
      relations: ['warehouse', 'branch'],
    });
    if (!warehouseBranch) {
      throw new NotFoundException('Sucursal no encontrada');
    }

    const data = await this.productRepository.findOne({
      where: {
        productInventory: {
          warehouseBranchId: warehouseBranch.id,
          productId: productId,
        },
      },
      relations: [
        'productInventory'
      ],
    });

    if (data.productInventory.length < 0) {
      throw new NotFoundException('Sin inventario para este producto en esta sucursal');
    }

    const response = {
      branchId: warehouseBranch.id,
      productId: product.id,
      maxStock: data.productInventory[0].maxStock,
      currentStock: data.productInventory[0].currentStock,
      minStock: data.productInventory[0].minStock,
      percentage: Number(((data.productInventory[0].currentStock * 100) / data.productInventory[0].maxStock).toFixed(2)),
    }

    return response;
  }

  async getRefillSmartRecomendations(productId: number) {
    // Step 1: Validate the product exists
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Step 2: Fetch inventory data for the product across all branches
    const inventories = await this.productInventoryRepository.find({
      where: { productId: productId },
      relations: ['warehouseBranch', 'warehouseBranch.branch'],
    });

    if (!inventories || inventories.length === 0) {
      throw new NotFoundException('Sin inventario para este producto en ninguna sucursal');
    }

    // Step 3: Calculate stock percentages and identify branches with low and high stock
    const branchStockData = inventories.map((item) => {
      const percentage = Number(((item.currentStock / item.maxStock) * 100).toFixed(2));
      return {
        branchId: item.warehouseBranch.branch.id,
        branchName: item.warehouseBranch.branch.name,
        currentStock: item.currentStock,
        originalStock: item.currentStock, // Preserve original stock for final response
        maxStock: item.maxStock,
        minStock: item.minStock,
        percentage,
        isLowStock: percentage <= 20, // Low stock threshold: ≤20% of max stock
      };
    });

    // Step 4: Separate branches into low-stock (receivers) and high-stock (donors)
    const lowStockBranches = branchStockData.filter((branch) => branch.isLowStock);
    const highStockBranches = branchStockData
      .filter((branch) => !branch.isLowStock)
      .sort((a, b) => b.percentage - a.percentage); // Sort by stock percentage (highest first)

    if (lowStockBranches.length === 0 || highStockBranches.length === 0) {
      return {
        message: 'No se necesitan recomendaciones de refill en este momento.',
        branches: branchStockData.map((branch) => ({
          branchName: branch.branchName,
          branchId: branch.branchId,
          currentStock: branch.originalStock, // Use original stock
          maxStock: branch.maxStock,
          percentage: branch.percentage,
        })),
        recommendations: [],
      };
    }

    // Step 5: Generate recommendations
    const recommendations = [];
    for (const lowStockBranch of lowStockBranches) {
      const targetStock = lowStockBranch.maxStock * 0.5; // Target: bring stock to 50% of max
      let neededStock = Math.max(0, targetStock - lowStockBranch.currentStock);

      if (neededStock <= 0) continue;

      // Distribute the needed stock among high-stock branches
      const totalHighStockAvailable = highStockBranches.reduce(
        (sum, branch) => sum + Math.max(0, branch.currentStock - branch.maxStock * 0.5),
        0,
      );

      if (totalHighStockAvailable === 0) continue;

      // Calculate contribution ratio for each high-stock branch
      for (const highStockBranch of highStockBranches) {
        const availableStock = Math.max(0, highStockBranch.currentStock - highStockBranch.maxStock * 0.5);
        if (availableStock <= 0) continue;

        // Proportional contribution based on available stock
        const contributionRatio = availableStock / totalHighStockAvailable;
        const recommendedQuantity = Math.min(neededStock, Math.round(neededStock * contributionRatio));

        if (recommendedQuantity > 0) {
          recommendations.push({
            originBranch: highStockBranch.branchName,
            destinyBranch: lowStockBranch.branchName,
            quantity: recommendedQuantity,
            origin_branch_id: highStockBranch.branchId,
            destiny_branch_id: lowStockBranch.branchId,
            product_id: productId,
            percentage_branch_origin: highStockBranch.percentage, // Add origin percentage
            percentage_branch_destiny: lowStockBranch.percentage, // Add destiny percentage
          });

          // Update stocks for next iteration (but don't affect branches output)
          highStockBranch.currentStock -= recommendedQuantity;
          lowStockBranch.currentStock += recommendedQuantity;
          neededStock -= recommendedQuantity;
        }

        if (neededStock <= 0) break;
      }
    }

    // Step 6: Format the response to match the Figma design
    return {
      branches: branchStockData.map((branch) => ({
        branchName: branch.branchName,
        branchId: branch.branchId,
        currentStock: branch.originalStock, // Use original stock
        maxStock: branch.maxStock,
        percentage: branch.percentage,
      })),
      recommendations: recommendations.length > 0 ? recommendations : 'No se necesitan recomendaciones de refill.',
    };
  }

  // 1. Informacion de ultimo refill devolver fecha de ultima reposicion y frecuencia de reposicion 10-7 POR MES ALTA, 6-4 POR MES MEDIA, 1-3 POR MES BAJA
  async getLastRefillByProduct(productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const lastRefill = await this.productRefillRepository.findOne({
      where: { productId: productId },
      order: { createdAt: 'DESC' },
      relations: ['originWarehouseBranch', 'destinyWarehouseBranch', 'originWarehouseBranch.branch', 'destinyWarehouseBranch.branch', 'productRefillStatus'],
    });

    console.log('lastRefill', lastRefill);

    if (!lastRefill) {
      throw new NotFoundException('No se encontro el ultimo refill para este producto');
    }

    // lista de refill en el ultimo mes
    const lastMonthRefills = await this.productRefillRepository.find({
      where: {
        productId: productId,
        createdAt: MoreThanOrEqual(new Date(new Date().setDate(new Date().getDate() - 30))),
      },
      relations: ['originWarehouseBranch', 'destinyWarehouseBranch'],
    });

    lastMonthRefills

    // 7-10 ALTA, 4-6 MEDIA, 1-3 BAJA
    const frecuency = lastMonthRefills.length;
    let frequency = 'Baja';
    if (frecuency >= 7 && frecuency <= 10) {
      frequency = 'Alta';
    } else if (frecuency >= 4 && frecuency <= 6) {
      frequency = 'Media';
    } else if (frecuency >= 1 && frecuency <= 3) {
      frequency = 'Baja';
    }


    const response = {
      productId: product.id,
      productName: product.name,
      lastRefillDate: lastRefill.createdAt.toLocaleDateString('es-SV', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      originBranch: lastRefill.originWarehouseBranch.branch.name,
      destinyBranch: lastRefill.destinyWarehouseBranch.branch.name,
      quantity: lastRefill.quantity,
      status: lastRefill.productRefillStatus.description,
      frequency,
    };
    return response;
  }
}
