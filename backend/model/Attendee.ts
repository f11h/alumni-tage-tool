import {MaxLength, Property} from '@tsed/common';
import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Course} from './Course';

@Entity()
export class Attendee {

    @PrimaryGeneratedColumn()
    @Property()
    id: number;

    @Column({ nullable: true })
    @MaxLength(50)
    @Property()
    name: string;

    @Column({unique: true})
    @MaxLength(200)
    @Property()
    token: string;

    @Column({ nullable: true })
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
