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
    console.log('🛒 INICIO verifyProductStock');
    console.log('👉 Parámetros recibidos:', { productId, branchId, unitsToSell });
  
    const qb = this.productInventoryRepository
      .createQueryBuilder('pi')
      .innerJoin('pi.product', 'p')
      .innerJoin('pi.warehouseBranch', 'wb')
      .innerJoin('wb.branch', 'b')
      .where('(pi.productId = :productId OR p.internal_code::INTEGER = :productId)', {
        productId,
      });
  
    console.log('👉 Query inicial construido.');
  
    if (branchId && Number(branchId) > 0) {
      qb.andWhere('b.id = :branchId', { branchId: Number(branchId) });
      console.log('👉 Filtrando por branchId:', branchId);
    } else {
      console.log('👉 No se está filtrando por branchId (se sumará stock global)');
    }
  
    console.log('👉 SQL Generado:', qb.getSql());
  
    const inventories = await qb.getMany();
  
    console.log('👉 Resultado de inventarios encontrados:', inventories.length);
    inventories.forEach((inv, index) => {
      console.log(`👉 Inventario [${index}]:`, {
        id: inv.id,
        productId: inv.productId,
        currentStock: inv.currentStock,
        warehouseBranchId: inv.warehouseBranchId,
      });
    });
  
    const totalStock = inventories.reduce((sum, inv) => sum + inv.currentStock, 0);
    console.log('👉 Total Stock Calculado:', totalStock);
  
    if (!inventories.length) {
      console.log('❌ No se encontró inventario para el producto.');
      throw new NotFoundException(
        `No se encontró inventario para el producto ${productId}${branchId ? ` en la sucursal ${branchId}` : ''}`,
      );
    }
  
    if (totalStock < unitsToSell) {
      console.log('❌ Stock insuficiente:', { totalStock, unitsToSell });
      throw new NotFoundException(
        `Stock insuficiente para el producto ${productId}. Disponible: ${totalStock}, solicitado: ${unitsToSell}`,
      );
    }
  
    console.log('✅ Stock suficiente. Validación finalizada.');
  }
  
  
  
  
  
  
}
