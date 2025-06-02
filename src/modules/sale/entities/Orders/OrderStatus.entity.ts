import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('order_status', { schema: 'sale' })
export class OrderStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
