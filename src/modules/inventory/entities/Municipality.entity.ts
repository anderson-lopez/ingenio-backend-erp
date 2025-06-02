import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Department } from './Department.entity';

@Entity('municipalities', { schema: 'inventory' })
export class Municipality extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'municipality_id' })
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'integer', name: 'department_id' })
    departmentId: number;

    @Column({ type: 'varchar', length: 500 })
    description: string;

    @JoinColumn({ name: 'department_id' })
    @ManyToOne(() => Department)
    department: Department;
}

