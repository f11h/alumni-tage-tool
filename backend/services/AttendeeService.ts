import {Injectable} from '@tsed/di';
import {TypeORMService} from '@tsed/typeorm';
import {Repository} from 'typeorm';
import {OnServerReady} from '@tsed/common';
import {Attendee} from '../model/Attendee';
import {Course} from '../model/Course';
import {CourseService} from './CourseService';
import {BadRequest} from 'ts-httpexceptions';

@Injectable()
export class AttendeeService implements OnServerReady {
    private repo: Repository<Attendee>;

    public constructor(
        private orm: TypeORMService,
        private courseService: CourseService,
    ) {
    }

    $onServerReady(): void | Promise<any> {
        this.repo = this.orm.get('default').getRepository(Attendee);
    }

    public getAttendees(): Promise<Attendee[]> {
        return this.repo.find({relations: ['courses']});
    }

    public getAttendeeByTokenOrFail(token: string): Promise<Attendee> {
        return this.repo.findOneOrFail({where: {token}, relations: ['courses']});
    }

    public getAttendeeByToken(token: string): Promise<Attendee> {
        return this.repo.findOne({where: {token}, relations: ['courses']});
    }

    public getAttendeeById(id: number, withCourses?: boolean): Promise<Attendee> {
        return this.repo.findOneOrFail(id, {relations: withCourses ? ['courses'] : []});
    }

    public async createAttendee(attendee: Attendee): Promise<Attendee> {
        attendee.id = null;
        return this.repo.save(attendee);
    }

    public async saveAttendee(attendee: Attendee): Promise<Attendee> {
        return this.repo.save(attendee);
    }

    public async setAttendeesCourses(attendee: Attendee, courseIds: number[]) {
        const courses: Course[] = [];
        const classes: string[] = [];
        const timeslots: number[] = [];

        if (courseIds.length !== 3 && courseIds.length !== 0) {
            throw new BadRequest('Excatly 3 or 0 course have to be chosen.');
        }

        // map courseIds to course
        for (const courseId of courseIds) {
            courses.push(await this.courseService.getCourseById(courseId));
        }

        const oldCourses = attendee.courses;
        attendee.courses = [];
        await this.repo.save(attendee);

        // check: Only one course per class and only one course per timeslot
        // check: course not full
        for (const course of courses) {
            if (classes.includes(course.class) || timeslots.includes(course.timeSlot)) {
                attendee.courses = oldCourses;
                await this.repo.save(attendee);

                throw new BadRequest('Each class can only be chosen once or timeslot is double occupied.');
            } else {
                classes.push(course.class);
                timeslots.push(course.timeSlot);
            }

            if (course.maxAttendee - await this.courseService.countAttendeesForCourse(course) < 1) {
                attendee.courses = oldCourses;
                await this.repo.save(attendee);

                throw new BadRequest('Course ' + course.name + ' is full :-(');
            }

        }

        // check: Sek2 course must be chosen
        if (courseIds.length !== 0 && !classes.includes('sek2')) {
            attendee.courses = oldCourses;
            await this.repo.save(attendee);

            throw new BadRequest('Sek2 course must be chosen');
        }

        attendee.courses = courses;
        await this.repo.save(attendee);
    }
}
