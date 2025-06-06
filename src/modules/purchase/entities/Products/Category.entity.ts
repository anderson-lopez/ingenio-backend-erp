import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { SubCategory } from '../index';

@Entity('categories', { schema: 'sale' })
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
  subCategories: SubCategory[];
}
