import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import {
  SubCategory,
  Brand,
  TypeProduct,
  UnitMeasure,
  ProductImages,
} from '../index';
import { ProductInventory } from '../../../inventory/entities/index';
@Entity('products', { schema: 'inventory' })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  internal_code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'weight_kg',
  })
  weightKg: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'length_cm',
  })
  lengthCm: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'width_cm',
  })
  widthCm: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'height_cm',
  })
  heightCm: number;

  @Column({ type: 'integer', nullable: true, name: 'units_per_box' })
  unitsPerBox: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, name: 'Purchase_price' })
  PurchasePrice: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, name: 'profit_margin' })
  profitMargin: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'offer_price',
  })
  offerPrice: number;

  @Column({
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
    name: 'offer_profit_margin',
  })
  offerProfitMargin: number;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'barcode_number',
  })
  barCodeNumber: string;

  @Column({ type: 'integer', nullable: true, name: 'subcategory_id' })
  subcategoryId: number;

  @ManyToOne(() => SubCategory)
  @JoinColumn({ name: 'subcategory_id' })
  subCategory: SubCategory;

  @OneToMany(() => ProductImages, (productImages) => productImages.product)
  productImages: ProductImages[];

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToOne(() => TypeProduct)
  @JoinColumn({ name: 'type_product_id' })
  typeProduct: TypeProduct;

  @ManyToOne(() => UnitMeasure)
  @JoinColumn({ name: 'unit_measure' })
  unitMeasure: UnitMeasure;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'sku_code' })
  skuCode: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'buy_Purchase',
  })
  buyPurchase: number;

  @Column({ type: 'date', nullable: true, name: 'expire_date' })
  expireDate: Date;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'float', name: 'warehouse_cost', nullable: true })
  warehouseCost: number;

  @Column({ type: 'varchar', name: 'provider_number', nullable: true })
  providerNumber: string;

  @Column({ type: 'varchar', name: 'san_salvador_location', nullable: true })
  sanSalvadorLocation: string;

  @OneToMany(
    () => ProductInventory,
    (productInventory) => productInventory.product,
  )
  productInventory: ProductInventory[];
}
