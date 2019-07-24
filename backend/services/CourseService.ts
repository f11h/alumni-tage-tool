import {Injectable} from '@tsed/di';
import {TypeORMService} from '@tsed/typeorm';
import {Course} from '../model/Course';
import {Repository} from 'typeorm';
import {OnServerReady} from '@tsed/common';

@Injectable()
export class CourseService implements OnServerReady {
    private repo: Repository<Course>;

    public constructor(
        private orm: TypeORMService,
    ) {
    }

    $onServerReady(): void | Promise<any> {
        this.repo = this.orm.get('default').getRepository(Course);
    }

    public saveCourse(course: Course): Promise<Course> {
        return this.repo.save(course);
    }

    public async getAllCourses(withAttendees: boolean): Promise<Course[]> {
        const courses = await this.repo.find({relations: ['attendees']});

        for (const course of courses) {
            course.attendeeCount = course.attendees.length;

            if (!withAttendees) {
                course.attendees = null;
            }
        }

        return courses;
    }

    public async countAttendeesForCourse(course: Course): Promise<number> {
        return (await this.repo.findOne(course.id, {relations: ['attendees']})).attendees.length;
    }
}
