import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('user_branch', { schema: 'sale' })
export class UserBranch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  branch_id: number;

  @Column({ type: 'integer' })
  user_id: number;
}
