import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Purchase } from '../index';

@Entity('PurchaseDetails', { schema: 'Purchase' })
export class PurchaseDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'purchase_id' })
  PurchaseId: number;

  @Column({ type: 'integer', name: 'product_id' })
  productId: number;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'unit_price' })
  unitPrice: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'sub_total' })
  subTotal: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  discount: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'tax_amount' })
  taxAmount: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'total_line' })
  totalLine: number;

  @ManyToOne(() => Purchase, (Purchase) => Purchase.PurchaseDetails)
  @JoinColumn({ name: 'purchase_id' })
  Purchase: Purchase;
}
