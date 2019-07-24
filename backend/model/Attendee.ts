import {MaxLength, Property} from '@tsed/common';
import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique} from 'typeorm';
import {Course} from './Course';

@Entity()
export class Attendee {

    @PrimaryGeneratedColumn()
    @Property()
    id: number;

    @Column()
    @MaxLength(50)
    @Property()
    name: string;

    @Column({unique: true})
    @MaxLength(200)
    @Property()
    token: string;

    @Column()
    @MaxLength(100)
    @Property()
    password: string;

    @ManyToMany(() => Course, course => course.attendees)
    @Property()
    courses: Course[];

    public constructor(course?: Partial<Attendee>) {
        Object.assign(this, course);
    }
}
