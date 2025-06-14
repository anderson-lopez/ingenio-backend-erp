import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'sale', name: 'sale_status' })
export class SaleStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;
}
