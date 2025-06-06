import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('discount_approvals', { schema: 'Purchase' })
export class DiscountApproval extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'cashier_id' })
  cashierId: number;

  @Column({ type: 'integer', name: 'manager_id' })
  managerId: number;

  @Column({ type: 'integer', name: 'product_id' })
  productId: number;

  @Column({ type: 'integer', name: 'purchase_id' })
  PurchaseId: number;

  @Column({ type: 'double precision', name: 'original_product_price' })
  originalProductPrice: number;

  @Column({ type: 'double precision', name: 'discount_product_price' })
  discountProductPrice: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'discount_amount' })
  discountAmount: number;

  @Column({
    type: 'numeric',
    precision: 5,
    scale: 2,
    name: 'discount_percentage',
  })
  discountPercentage: number;

  @Column({
    type: 'timestamp',
    name: 'approved_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  approvedAt: Date;
}
