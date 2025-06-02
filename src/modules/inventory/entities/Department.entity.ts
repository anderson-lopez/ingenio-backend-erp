import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

@Entity('departments', { schema: 'inventory' })
export class Department {
    @PrimaryGeneratedColumn({ name: 'department_id' })
    id: number;

    @Column({ type: 'varchar', length: 10, unique: true })
    code: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 500 })
    description: string;
}