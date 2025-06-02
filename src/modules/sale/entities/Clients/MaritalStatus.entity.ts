import { Entity, PrimaryGeneratedColumn, BaseEntity, Column } from 'typeorm';

@Entity('marital_status', { schema: 'sale' })
export class MaritalStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
