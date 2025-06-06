import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Suppliers', { schema: 'Purchase' }) // 🔥 Define tabla y esquema explícitamente
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  contact_name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  notes: string;

  @Column()
  branch_id: number;
}
