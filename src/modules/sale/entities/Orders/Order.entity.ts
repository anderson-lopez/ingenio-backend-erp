import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderDetail } from './OrderDetail.entity';
import { OrderStatus } from './OrderStatus.entity';
import { Branch } from 'src/modules/inventory/entities';
import { Client } from '../Clients/Client.entity';
import { SaleDocumentType } from '../Payments/SaleDocumentTypes.entity';

@Entity('orders', { schema: 'sale' })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'client_id' })
  clientId: number;

  @Column({ type: 'varchar', name: 'guest_name', length: 100 })
  guestName: string;

  @Column({ type: 'varchar', name: 'guest_email', length: 100 })
  guestEmail: string;

  @Column({ type: 'varchar', name: 'guest_phone', length: 20 })
  guestPhone: string;

  @Column({
    type: 'timestamp',
    name: 'order_date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  orderDate: Date;

  @Column({ type: 'integer', name: 'order_status_id' })
  orderStatusId: number;

  @Column({ type: 'integer', name: 'payment_method_id' })
  paymentMethodId: number;

  @Column({ type: 'text', name: 'shipping_address' })
  shippingAddress: string;

  @Column({ type: 'integer', name: 'pickup_branch_id' })
  pickupBranchId: number;

  @Column({ type: 'integer', name: 'guest_document_type' })
  guestDocumentType: number;

  @Column({ type: 'varchar', name: 'guest_document_number', length: 100 })
  guestDocumentNumber: string;

  @Column({ type: 'varchar', name: 'comments', length: 500 })
  comments: string;

  @Column({ type: 'double precision', name: 'subtotal' })
  subtotal: number;

  @Column({ type: 'double precision', name: 'discount' })
  discount: number;

  @Column({ type: 'double precision', name: 'total' })
  total: number;

  @Column({ type: 'varchar', name: 'register_number', length: 150 })
  registerNumber: string;

  @Column({ type: 'varchar', name: 'transfer_number', length: 150 })
  transferNumber: string;

  @Column({ type: 'integer', name: 'document_type_sale_id' })
  documentTypeSaleId: number;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: ['insert', 'update'],
  })
  orderDetails: OrderDetail[];

  @ManyToOne(() => OrderStatus)
  @JoinColumn({ name: 'order_status_id' })
  orderStatus: OrderStatus;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'pickup_branch_id' })
  pickupBranch: Branch;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => SaleDocumentType)
  @JoinColumn({ name: 'document_type_sale_id' })
  documentTypeSale: SaleDocumentType;
}
