import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { Category } from './Category.entity';

@Entity('subcategories', { schema: 'sale' })
export class SubCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relación con Category
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
