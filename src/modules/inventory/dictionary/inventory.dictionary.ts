export class InventoryDictionary {
  static readonly PRODUCT_STATUS = {
    OUT_OF_STOCK: 'AGOTADO',
    IN_STOCK: 'EN EXISTENCIA',
    OVER_STOCK: 'SOBRE_STOCK',
    LOW_STOCK: 'BAJO_STOCK',
    DEFAULT: 'SIN DEFINIR INVENTARIO',
  };

  static readonly PROFILES = {
    ADMINISTRATOR: 1,
    SELLER: 2,
    MANAGER: 3,
  };

  static readonly WAREHOUSES = {
    SAN_MIGUEL: 1,
    SAN_SALVADOR: 2,
    BODEGA_CENTRAL: 3,
  };

  static readonly ORDER_STATUS = {
    CREATED: 1,
    SALE_CREATED: 2,
    FINISHED: 3,
    SHIPED: 4,
    SHIPPING: 5,
    READY_SHIP: 6,
    PAYMENT_RECEIVED: 7,
  }

  static readonly SALE_STATUS = {
    SHIPED: 1,
    SHIPPING: 2,
    READY_SHIP: 3,
    PAYMENT_RECEIVED: 4,
    CREATED: 5,
    FINISHED: 7,
  }

  static readonly PRODUCT_REFILL_STATUS = {
    PENDING: 1,
    APROVED: 2,
  };
}
