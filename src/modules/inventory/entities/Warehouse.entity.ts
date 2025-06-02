import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Branch } from './Branch.entity';

@Entity('warehouse', { schema: 'sale' })
export class Warehouse extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    name: 'warehouse_location',
  })
  warehouseLocation: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'warehouse_cost' })
  warehouseCost: number;

  @ManyToMany(() => Branch, (branch) => branch.warehouse)
  @JoinTable({
    name: 'warehouse_branch',
    schema: 'inventory',
    joinColumn: {
      name: 'warehouse_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'branch_id',
      referencedColumnName: 'id',
    },
  })
  branchs: Branch[];
}
