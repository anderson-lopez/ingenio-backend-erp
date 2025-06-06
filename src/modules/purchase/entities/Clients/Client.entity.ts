import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ClientPoint } from './ClientPoints.entity';
import { ClientCategory } from './ClientCategory.entity';

@Entity('clients', { schema: 'sale' })
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'client_id' })
  id: number;

  @Column({ type: 'varchar', length: 100, name: 'code_client' })
  codeClient: string;

  @Column({ type: 'varchar', length: 100, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 100, name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality: string;

  @Column({ type: 'date', name: 'birth_date' })
  birthDate: Date;

  // gender_id
  @Column({ type: 'integer', name: 'gender_id' })
  genderId: number;

  @Column({ type: 'integer', name: 'marital_status_id' })
  maritalStatusId: number;

  @Column({ type: 'varchar', length: 50, name: 'dui_number' })
  duiNumber: string;

  @Column({ type: 'varchar', length: 50, name: 'nit_number' })
  nitNumber: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, name: 'mobile_number' })
  mobileNumber: string;

  @Column({ type: 'varchar', length: 20, name: 'office_number' })
  officeNumber: string;

  @Column({ type: 'varchar', length: 20, name: 'fax_number' })
  faxNumber: string;

  @Column({ type: 'text', name: 'full_address' })
  fullAddress: string;

  @Column({ type: 'varchar', length: 20, name: 'postal_code' })
  postalCode: string;

  @Column({ type: 'varchar', length: 255, name: 'company_name' })
  companyName: string;

  @Column({ type: 'varchar', length: 50, name: 'company_nit' })
  companyNit: string;

  @Column({ type: 'text', name: 'company_address' })
  companyAddress: string;

  @Column({ type: 'integer', name: 'client_category_id' })
  clientCategoryId: number;

  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ type: 'float', name: 'total_month_purchases' })
  totalMonthPurchases: number;

  @Column({ type: 'integer', name: 'user_id' })
  userId: number;

  @OneToMany(() => ClientPoint, (clientPoint) => clientPoint.client)
  clientPoints: ClientPoint[];

  @ManyToOne(() => ClientCategory)
  @JoinColumn({ name: 'client_category_id' })
  clientCategory: ClientCategory;

  @Column({ type: 'varchar', name: 'company_number' })
  companyNumber: string;

  @Column({ type: 'integer', name: 'branch_id' })
  branchId: number;

  @Column({ type: 'integer', name: 'document_type_id' })
  documentTypeId: number;

  @Column({ type: 'integer', name: 'department_id' })
  departmentId: number;

  @Column({ type: 'integer', name: 'municipality_id' })
  municipalityId: number;

  @Column({ type: 'integer', name: 'district_id' })
  districtId: number;

  @Column({ type: 'varchar', length: 100, name: 'street' })
  street: string;

  @Column({ type: 'integer', name: 'client_type' })
  clientType: number; // INDIVIDUAL o EMPRESA

  @Column({ type: 'varchar', length: 50, name: 'ncr_number' })
  ncrNumber: string;

  @Column({ type: 'integer', name: 'economic_activity_id' })
  economicActivityId: number;
}
