import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
} from 'typeorm';
import { Warehouse } from './Warehouse.entity';

@Entity('branchs', { schema: 'sale' })
export class Branch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  description: string;

  @ManyToMany(() => Warehouse, (warehouse) => warehouse.branchs)
  warehouse: Warehouse[];
}
