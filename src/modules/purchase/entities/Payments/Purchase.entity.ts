import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { PurchaseDetail } from './PurchaseDetail.entity';
import { Order } from '../Orders/Order.entity';
import { Supplier } from '../Suppliers/Supplier.entity'; // 🔥 Agregar importación

@Entity('Purchases', { schema: 'Purchase' })
export class Purchase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'branch_id', nullable: true })
  branchId: number;

  @Column({ name: 'id_user', nullable: true })
  idUser: number;

  @Column({ type: 'integer', name: 'client_id', nullable: true })
  clientId: number;

  // 🔥 Aquí colocamos las nuevas propiedades y la relación con Supplier
  @Column({ type: 'integer', name: 'supplier_id', nullable: true })
  supplierId: number;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ type: 'integer', name: 'document_type_id', nullable: true })
  documentTypeId: number;

  @Column({ type: 'varchar', length: 100, name: 'guest_name' })
  guestName: string;

  @Column({ type: 'varchar', length: 100, name: 'guest_email' })
  guestEmail: string;

  @Column({ type: 'varchar', length: 20, name: 'guest_phone' })
  guestPhone: string;

  @Column({
    type: 'timestamp',
    name: 'purchase_date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  PurchaseDate: Date;

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

  @Column({ type: 'integer', name: 'document_type_purchase_id', nullable: true })
  documentTypePurchaseId: number;

  @Column({ type: 'integer', name: 'purchase_status_id' })
  PurchaseStatusId: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'subtotal' })
  subTotal: number;  

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'total_discount' })
  totalDiscount: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    name: 'total_tax_amount',
  })
  totalTaxAmount: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'total_purchase' })
  totalPurchase: number;

  @OneToMany(() => PurchaseDetail, (PurchaseDetail) => PurchaseDetail.Purchase, {
    cascade: ['insert', 'update'],
  })
  PurchaseDetails: PurchaseDetail[];

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'varchar', length: 255, name: 'invoice_number', nullable: true })
  invoiceNumber: string;

  @Column({ type: 'integer', name: 'cashier_id', nullable: true })
  cashierId: number;

  @Column({ type: 'integer', name: 'manager_id', nullable: true })
  managerId: number;

  @Column({ type: 'varchar', length: 255, name: 'wms_code', nullable: true })
  wmsCode: string;

  @Column({ type: 'varchar', length: 255, name: 'document_path', nullable: true })
  documentPath: string;

 

}
