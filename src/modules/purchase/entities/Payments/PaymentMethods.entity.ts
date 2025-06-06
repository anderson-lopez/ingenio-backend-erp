import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('payment_methods', { schema: 'Purchase' })
export class PaymentMethod extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;
}
