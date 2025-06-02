import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Product } from '../../sale/entities/Products/Product.entity';
import { WarehouseBranch } from './WarehouseBranch.entity';
import { LevelZone } from './LevelZone.entity';
import { RackZone } from './RackZone.entity';
import { ProductRepositionFrecuency } from './ProductRepositionFrecuency.entity';
import { ProductRotation } from './ProductRotation.entity';

@Entity('products_inventory', { schema: 'inventory' })
export class ProductInventory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'warehouse_branch_id' })
  warehouseBranchId: number;

  @Column({ type: 'integer', name: 'rack_zone_id' })
  rackZoneId: number;

  @Column({ type: 'integer', name: 'level_zone_id' })
  levelZoneId: number;

  @Column({ type: 'varchar', length: 50 })
  bin: string;

  @Column({ type: 'integer', name: 'product_id' })
  productId: number;

  @Column({ type: 'integer', name: 'alternative_rack_zone_id', nullable: true })
  alternativeRackZoneId: number;

  @Column({
    type: 'integer',
    name: 'alternative_level_zone_id',
    nullable: true,
  })
  alternativeLevelZoneId: number;

  @Column({ type: 'integer', name: 'monthly_sales_avg' })
  monthlySalesAvg: number;

  @Column({ type: 'integer', name: 'min_stock' })
  minStock: number;

  @Column({ type: 'integer', name: 'max_stock' })
  maxStock: number;

  @Column({ type: 'integer', name: 'current_stock' })
  currentStock: number;

  @Column({ type: 'integer', name: 'product_availability_id', nullable: true })
  productAvailabilityId: number;

  @Column({ type: 'integer', name: 'stock_life_cycle_days', nullable: true })
  stockLifeCycleDays: number;

  @Column({ type: 'boolean', name: 'is_fifo', nullable: true })
  isFifo: boolean;

  @Column({ type: 'boolean', name: 'is_fefo', nullable: true })
  isFefo: boolean;

  @Column({ type: 'integer', name: 'average_picking_minutes', nullable: true })
  averagePickingMinutes: number;

  @Column({
    type: 'integer',
    name: 'product_reposition_frecuency',
    nullable: true,
  })
  productRepositionFrecuency: number;

  @Column({ type: 'integer', name: 'product_rotation', nullable: true })
  productRotation: number;

  @Column({ type: 'varchar', name: 'warehouse_zone_location', nullable: true })
  warehouseZoneLocation: string;

  @Column({
    type: 'varchar',
    name: 'alternative_zone_location',
    nullable: true,
  })
  alternativeZoneLocation: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => WarehouseBranch)
  @JoinColumn({ name: 'warehouse_branch_id' })
  warehouseBranch: WarehouseBranch;

  @ManyToOne(() => RackZone)
  @JoinColumn({ name: 'rack_zone_id' })
  rackZone: RackZone;

  @ManyToOne(() => LevelZone)
  @JoinColumn({ name: 'level_zone_id' })
  levelZone: LevelZone;

  @ManyToOne(() => RackZone)
  @JoinColumn({ name: 'alternative_rack_zone_id' })
  alternativeRackZone: RackZone;

  @ManyToOne(() => LevelZone)
  @JoinColumn({ name: 'alternative_level_zone_id' })
  alternativeLevelZone: LevelZone;

  @ManyToOne(() => ProductRepositionFrecuency)
  @JoinColumn({ name: 'product_reposition_frecuency' })
  productRepositionFrecuencyEntity: ProductRepositionFrecuency;

  @ManyToOne(() => ProductRotation)
  @JoinColumn({ name: 'product_rotation' })
  productRotationEntity: ProductRotation;
}
