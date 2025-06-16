import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { SaleDetail } from './SaleDetail.entity';
import { Order } from '../Orders/Order.entity';

@Entity('sales', { schema: 'sale' })
export class Sale extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'client_id', nullable: true })
  clientId: number;

  @Column({ name: 'id_user', nullable: true })
  idUser: number;

  @Column({ type: 'varchar', length: 100, name: 'guest_name' })
  guestName: string;

  @Column({ type: 'varchar', length: 100, name: 'guest_email' })
  guestEmail: string;

  @Column({ type: 'varchar', length: 20, name: 'guest_phone' })
  guestPhone: string;

  @Column({
    type: 'timestamp',
    name: 'sale_date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  saleDate: Date;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'integer', name: 'payment_method_id', nullable: true })
  paymentMethodId: number;

  @Column({ type: 'integer', name: 'guest_document_type', nullable: true })
  guestDocumentType: number;

  @Column({ type: 'varchar', length: 100, name: 'guest_document_number' })
  guestDocumentNumber: string;

  @Column({ type: 'varchar', length: 500 })
  comments: string;

  @Column({ type: 'integer', name: 'order_id' })
  orderId: number;

  @Column({ type: 'varchar', length: 150, name: 'register_number' })
  registerNumber: string;

  @Column({ type: 'varchar', length: 150, name: 'transfer_number' })
  transferNumber: string;

  @Column({ type: 'integer', name: 'document_type_sale_id' })
  documentTypeSaleId: number;

  @Column({ type: 'integer', name: 'sale_status_id' })
  saleStatusId: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'subtotal' })
  subtotal: number;
 
  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'total_discount' })
  totalDiscount: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    name: 'total_tax_amount',
  })
  totalTaxAmount: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'total_sale' })
  totalSale: number;

  @OneToMany(() => SaleDetail, (saleDetail) => saleDetail.sale, {
    cascade: ['insert', 'update'],
  })
  saleDetails: SaleDetail[];

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
