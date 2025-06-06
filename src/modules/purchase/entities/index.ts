// products
import { Product } from './Products/Product.entity';
import { Category } from './Products/Category.entity';
import { Brand } from './Products/Brands.entity';
import { SubCategory } from './Products/SubCategory.entity';
import { ProductImages } from './Products/ProductImage.entity';
import { TypeProduct } from './Products/TypeProduct.entity';
import { UnitMeasure } from './Products/UnitMeasure.entity';
// clients
import { Client } from './Clients/Client.entity';

// suppliers
import { Supplier } from './Suppliers/Supplier.entity';

// payments
import { PaymentMethod } from './Payments/PaymentMethods.entity';
import { PurchaseDocumentType } from './Payments/PurchaseDocumentTypes.entity';

// purchases
import { Purchase } from './Payments/Purchase.entity';
import { PurchaseDetail } from './Payments/PurchaseDetail.entity';

// orders (si aplica, como en sales)
import { Order } from './Orders/Order.entity';
import { OrderDetail } from './Orders/OrderDetail.entity';

// discounts (opcional)
import { DiscountApproval } from './Payments/DiscountApproval.entity';

export {
  Product,
  Category,
  Brand,
  SubCategory,
  ProductImages,
  TypeProduct,
  UnitMeasure,
  Supplier,
  PaymentMethod,
  PurchaseDocumentType,
  Purchase,
  PurchaseDetail,
  Order,
  OrderDetail,
  DiscountApproval,
  Client, // 🔥 AGREGADO AQUÍ
};
