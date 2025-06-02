import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { Warehouse } from './Warehouse.entity';
import { Branch } from './Branch.entity';

@Entity('warehouse_branch', { schema: 'inventory' })
export class WarehouseBranch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'warehouse_id' })
  warehouseId: number;

  @Column({ type: 'integer', name: 'branch_id' })
  branchId: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.branchs)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => Branch, (branch) => branch.warehouse)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;
}
