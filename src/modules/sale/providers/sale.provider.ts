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
    const qb = this.productInventoryRepository
      .createQueryBuilder('pi')
      .innerJoin('pi.product', 'p')
      .innerJoin('pi.warehouseBranch', 'wb')
      .innerJoin('wb.branch', 'b')
      .where('(pi.productId = :productId OR p.internal_code = :productId)', {
        productId,
      });
  
    if (branchId && branchId > 0) {
      qb.andWhere('b.id = :branchId', { branchId });
    }
  
    const inventories = await qb.getMany();
  
    if (!inventories.length) {
      throw new NotFoundException(
        `No se encontró inventario para el producto ${productId}${branchId ? ` en la sucursal ${branchId}` : ''}`,
      );
    }
  
    const totalStock = inventories.reduce((sum, inv) => sum + inv.currentStock, 0);
  
    if (totalStock < unitsToSell) {
      throw new NotFoundException(
        `Stock insuficiente para el producto ${productId}. Disponible: ${totalStock}, solicitado: ${unitsToSell}`,
      );
    }
  }
  
  
  
  
  
}
