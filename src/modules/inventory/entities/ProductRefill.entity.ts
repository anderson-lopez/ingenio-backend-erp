import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductRefillStatus } from './ProductRefillStatus.entity';
import { Product } from 'src/modules/sale/entities';
import { WarehouseBranch } from './WarehouseBranch.entity';

@Entity('product_refill', { schema: 'inventory' })
export class ProductRefill extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'origin_warehouse_branch_id' })
  originWarehouseBranchId: number;

  @Column({ type: 'integer', name: 'destiny_warehouse_branch_id' })
  destinyWarehouseBranchId: number;

  @Column({ type: 'double precision' })
  quantity: number;

  @Column({ type: 'timestamp', name: 'created_at', default: 'now()' })
  createdAt: Date;

  @Column({ type: 'integer', name: 'product_id' })
  productId: number;

  @Column({ type: 'integer', name: 'product_refill_status_id' })
  productRefillStatusId: number;

  // refill_type
  @Column({ type: 'varchar', name: 'refill_type' })
  refill_type: string;

  @ManyToOne(() => ProductRefillStatus)
  @JoinColumn({ name: 'product_refill_status_id' })
  productRefillStatus: ProductRefillStatus;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => WarehouseBranch)
  @JoinColumn({ name: 'origin_warehouse_branch_id' })
  originWarehouseBranch: WarehouseBranch;

  @ManyToOne(() => WarehouseBranch)
  @JoinColumn({ name: 'destiny_warehouse_branch_id' })
  destinyWarehouseBranch: WarehouseBranch;
}
