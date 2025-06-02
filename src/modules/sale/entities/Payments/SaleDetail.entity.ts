import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Sale } from '../index';

@Entity('sale_details', { schema: 'sale' })
export class SaleDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'sale_id' })
  saleId: number;

  @Column({ type: 'integer', name: 'product_id' })
  productId: number;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'unit_price' })
  unitPrice: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  discount: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'tax_amount' })
  taxAmount: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'total_line' })
  totalLine: number;

  @ManyToOne(() => Sale, (sale) => sale.saleDetails)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;
}
