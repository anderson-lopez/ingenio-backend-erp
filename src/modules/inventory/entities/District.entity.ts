// create table districts
// (
//     district_id     serial
//         primary key,
//     name            varchar(100) not null,
//     municipality_id integer
//         references municipalities,
//     description     varchar(500) not null
// );
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Municipality } from './Municipality.entity';

@Entity('districts', { schema: 'inventory' })
export class District extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'district_id' })
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'integer', name: 'municipality_id' })
    municipalityId: number;

    @Column({ type: 'varchar', length: 500 })
    description: string;

    @JoinColumn({ name: 'municipality_id' })
    @ManyToOne(() => Municipality)
    municipality: Municipality;
}