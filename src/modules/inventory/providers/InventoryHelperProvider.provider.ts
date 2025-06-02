import { Product } from './../../sale/entities/Products/Product.entity';
import { Injectable } from '@nestjs/common';
import { ProductInventory } from '../entities';
import { InventoryDictionary } from '../dictionary/inventory.dictionary';

@Injectable()
export class InventoryHelperProvider {
  convertMonthToWeeks(month: number): number {
    return month * 4;
  }

  productAvailableStatus(productInventory: ProductInventory[]) {
    // TO DO CHECK IF PRODUCT IS IN OVER STOCK

    if (productInventory.length === 0)
      return InventoryDictionary.PRODUCT_STATUS.DEFAULT;
    const isExistenceStatus = productInventory.filter(
      (product) => product.minStock < product.currentStock,
    );
    if (isExistenceStatus.length === productInventory.length)
      return InventoryDictionary.PRODUCT_STATUS.IN_STOCK;
    if (isExistenceStatus.length < productInventory.length)
      return InventoryDictionary.PRODUCT_STATUS.LOW_STOCK;

    const isWithoutStock = productInventory.filter(
      (product) => product.currentStock === 0,
    );
    if (isWithoutStock.length === productInventory.length)
      return InventoryDictionary.PRODUCT_STATUS.OUT_OF_STOCK;
  }

  generateBarcode(product: Product) {
    // Generar código EAN-13
    // Formato: [Prefijo País][Código Empresa][Código Producto][Dígito Control]

    // Prefijo país (ejemplo: 77 para Colombia, puedes ajustarlo)
    const countryPrefix = '77';

    // Código de empresa (podemos usar el brand ID con padding)
    const brandCode = product.brand?.id.toString().padStart(4, '0') || '0000';

    // Código de producto (usamos el ID del producto con padding)
    const productCode = product.id.toString().padStart(5, '0');

    // Concatenar los primeros 12 dígitos
    const baseCode = `${countryPrefix}${brandCode}${productCode}`;

    // Calcular dígito de control
    const checkDigit = this.calculateCheckDigit(baseCode);

    // Código final de 13 dígitos
    const barcode = `${baseCode}${checkDigit}`;

    return barcode;
  }

  private calculateCheckDigit(baseCode: string): number {
    const digits = baseCode.split('').map(Number);

    // Suma de posiciones impares (0-based) * 1
    const oddSum = digits.reduce(
      (sum, digit, index) => (index % 2 === 0 ? sum + digit : sum),
      0,
    );

    // Suma de posiciones pares * 3
    const evenSum =
      digits.reduce(
        (sum, digit, index) => (index % 2 === 1 ? sum + digit : sum),
        0,
      ) * 3;

    // Total
    const total = oddSum + evenSum;

    // Dígito de control
    const nextTen = Math.ceil(total / 10) * 10;
    return nextTen - total;
  }

  isUrl(value: string) {
    return /^(https?:\/\/)/.test(value);
  }
}
