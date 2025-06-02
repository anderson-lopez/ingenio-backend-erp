import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity('branchs', { schema: 'sale' })
export class Branch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => User, (user) => user.branches)
  users: User[];
}
