import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('profile_permission', { schema: 'security' })
export class ProfilePermission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'profile_id' })
  profileId: number;

  @Column({ name: 'permission_id' })
  permissionId: number;
}
