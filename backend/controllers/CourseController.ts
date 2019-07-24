import {Constant, Controller, Get, Maximum, Minimum, QueryParams} from '@tsed/common';
import {Course} from '../model/Course';
import {CourseService} from '../services/CourseService';
import {Unauthorized} from 'ts-httpexceptions';
import {TokenService} from '../services/token.service';

@Controller('/courses')
export class CourseController {

    @Constant('password')
    private readonly password: string;

    public constructor(
        private courseService: CourseService,
        private tokenService: TokenService,
    ) {
    }

    @Get('/tokens')
    public tokens(
        @QueryParams("n") count: number,
    ): string[] {
        count = count || 10;

        return this.tokenService.generateUniqueTokens(count);
    }

    @Get('/')
    public async x(
        @QueryParams('withAttendees') withAttendees: boolean,
        @QueryParams('auth') auth: string,
    ): Promise<Course[]> {
        if (withAttendees && auth !== this.password) {
            throw(new Unauthorized(""));
        }

        return await this.courseService.getAllCourses(true);
    }
}
