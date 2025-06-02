// id                     serial
// constraint product_images_pk
//     primary key,
// product_image_mongo_id varchar(200),
// is_cover               boolean,
// product_id             integer
// constraint product_images_products_id_fk
//     references products,
// mongo_bucket_name      varchar(50)

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Product } from './Product.entity';

@Entity('product_images', { schema: 'inventory' })
export class ProductImages extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    name: 'product_image_mongo_id',
  })
  productImageMongoId: string;

  @Column({ type: 'boolean', name: 'is_cover' })
  isCover: boolean;

  @Column({ type: 'integer', name: 'product_id' })
  productId: number;

  @Column({ type: 'varchar', length: 50, name: 'mongo_bucket_name' })
  mongoBucketName: string;

  @Column({ type: 'boolean', name: 'is_gallery', nullable: true })
  isGallery: boolean;

  @Column({ type: 'boolean', name: 'is_barcode', nullable: true })
  isBarcode: boolean;

  @ManyToOne(() => Product, (product) => product.productImages)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
