import {MaxLength, Property} from '@tsed/common';
import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Attendee} from './Attendee';

@Entity()
export class Course {

    @PrimaryGeneratedColumn()
    @Property()
    id: number;

    @Column()
    @MaxLength(50)
    @Property()
    name: string;

    @Column()
    @MaxLength(200)
    @Property()
    description: string;

    @Column()
    @Property()
    maxAttendee: number;

    @ManyToMany(() => Attendee, attendee => attendee.courses)
    @JoinTable()
    @Property()
    attendees: Attendee[];

    @Property()
    attendeeCount: number;

    @Column()
    @Property()
    mandatory: boolean;

    @Column()
    @Property()
    class: string;

    @Column()
    @Property()
    timeSlot: number;

    public constructor(course?: Partial<Course>) {
        Object.assign(this, course);
    }

}
