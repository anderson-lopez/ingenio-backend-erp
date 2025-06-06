import { Entity, PrimaryGeneratedColumn, BaseEntity, Column } from 'typeorm';

@Entity('document_type_Purchase', { schema: 'Purchase' })
export class PurchaseDocumentType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
