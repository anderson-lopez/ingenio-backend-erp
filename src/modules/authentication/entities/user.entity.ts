import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Profile } from './Profiles.entity';
import { Branch } from './Branch.entity';

@Entity({ name: 'users', schema: 'security' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  active: boolean;

  @Column()
  address: string;

  @Column({ name: 'user_type_id' })
  userTypeId: number;

  @Column({ name: 'master_password' })
  masterPassword: string;

  @ManyToMany(() => Profile, (profile) => profile.users)
  @JoinTable({
    name: 'user_profile', // Nombre de la tabla intermedia
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'profile_id',
      referencedColumnName: 'id',
    },
  })
  profiles: Profile[];

  @ManyToMany(() => Branch, (branch) => branch.users)
  @JoinTable({
    name: 'user_branch',
    schema: 'sale',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'branch_id',
      referencedColumnName: 'id',
    },
  })
  branches: Branch[];
}
