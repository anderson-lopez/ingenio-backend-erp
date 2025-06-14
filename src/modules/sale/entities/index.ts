// products
import { Product } from './Products/Product.entity';
import { Category } from './Products/Category.entity';
import { Brand } from './Products/Brands.entity';
import { SubCategory } from './Products/SubCategory.entity';
import { ProductImages } from './Products/ProductImage.entity';
import { TypeProduct } from './Products/TypeProduct.entity';
import { UnitMeasure } from './Products/UnitMeasure.entity';
import { SaleStatus } from './Products/SaleStatus.entity';
// clients
import { Client } from './Clients/Client.entity';
import { ClientCategory } from './Clients/ClientCategory.entity';
import { Gender } from './Clients/Genders.entity';
import { MaritalStatus } from './Clients/MaritalStatus.entity';
import { ClientDocumentType } from './Clients/ClientDocumentTypes.entity';

// Payment
import { PaymentMethod } from './Payments/PaymentMethods.entity';
import { SaleDocumentType } from './Payments/SaleDocumentTypes.entity';
import { ClientPoint } from './Clients/ClientPoints.entity';
import { Sale } from './Payments/Sale.entity';
import { SaleDetail } from './Payments/SaleDetail.entity';
import { Order } from './Orders/Order.entity';
import { OrderDetail } from './Orders/OrderDetail.entity';
import { DiscountApproval } from './Payments/DiscountApproval.entity';

export {
  Product,
  Category,
  Brand,
  SubCategory,
  ProductImages,
  TypeProduct,
  UnitMeasure,
  Client,
  ClientCategory,
  Gender,
  MaritalStatus,
  PaymentMethod,
  SaleDocumentType,
  ClientDocumentType,
  ClientPoint,
  Sale,
  SaleDetail,
  SaleStatus,
  Order,
  OrderDetail,
  DiscountApproval,
};
