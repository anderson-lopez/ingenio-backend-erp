import { Entity, PrimaryGeneratedColumn, BaseEntity, Column } from 'typeorm';

@Entity('genders', { schema: 'Purchase' })
export class Gender extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
