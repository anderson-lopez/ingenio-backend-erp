import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './Order.entity';
import { Product } from '../Products/Product.entity';

@Entity('order_details', { schema: 'sale' })
export class OrderDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'order_id' })
  orderId: number;

  @Column({ type: 'integer', name: 'product_id' })
  productId: number;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'unit_price' })
  unitPrice: number;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
