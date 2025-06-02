import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductInventory } from 'src/modules/inventory/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SaleProvider {
  constructor(
    @InjectRepository(ProductInventory)
    private readonly productInventoryRepository: Repository<ProductInventory>,
  ) {}

  async updateProductInventory(
    productId: number,
    branchId: number,
    unitsProductSelled: number,
  ) {
    const productInventory = await this.productInventoryRepository.findOne({
      where: {
        productId,
        warehouseBranch: {
          branch: {
            id: branchId,
          },
        },
      },
    });

    if (!productInventory) {
      throw new NotFoundException('Product inventory not found');
    }
    productInventory.currentStock =
      productInventory.currentStock - unitsProductSelled;
    await this.productInventoryRepository.save(productInventory);
    return productInventory;
  }

  async verifyProductStock(
    productId: number,
    branchId: number,
    unitsToSell: number,
  ) {
    const productInventory = await this.productInventoryRepository.findOne({
      where: {
        productId,
        warehouseBranch: {
          branch: {
            id: branchId,
          },
        },
      },
    });

    if (!productInventory) {
      throw new NotFoundException(
        'Product inventory not found for product id ' + productId,
      );
    }

    if (productInventory.currentStock < unitsToSell) {
      throw new NotFoundException(
        'Product stock is not enough for product id ' + productId,
      );
    }
  }
}
