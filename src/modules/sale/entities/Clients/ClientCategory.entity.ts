import { Entity, PrimaryGeneratedColumn, BaseEntity, Column } from 'typeorm';

@Entity('client_categories', { schema: 'sale' })
export class ClientCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer', name: 'minimum_monthly_purchases' })
  minimumMonthlyPurchases: number;
}
