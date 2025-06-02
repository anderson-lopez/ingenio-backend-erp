import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from '../index';

@Entity('client_points', { schema: 'sale' })
export class ClientPoint extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'double precision', name: 'total_points' })
  totalPoints: number;

  @Column({ type: 'boolean' })
  redeemed: boolean;

  @Column({ type: 'date', nullable: true, name: 'redeem_date' })
  redeemDate: Date;

  @Column({ type: 'integer', name: 'client_id' })
  clientId: number;

  @ManyToOne(() => Client, (client) => client.clientPoints)
  @JoinColumn({ name: 'client_id' })
  client: Client;
}
