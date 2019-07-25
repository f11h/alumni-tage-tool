import {BodyParams, Constant, Controller, Get, PathParams, Put, QueryParams} from '@tsed/common';
import {Unauthorized} from 'ts-httpexceptions';
import {Attendee} from '../model/Attendee';
import {AttendeeService} from '../services/AttendeeService';

@Controller('/attendees')
export class AttendeeController {

    @Constant('password')
    private readonly password: string;

    public constructor(
        private attendeeService: AttendeeService
    ) {
    }

    @Get('/')
    public async getAttendees(
        @QueryParams('token') token: string,
        @QueryParams('auth') auth: string,
    ): Promise<Attendee[]> {
        if (token) {
            return [await this.attendeeService.getAttendeeByToken(token)];
        } else {
            if (auth !== this.password) throw(new Unauthorized(''));

            return await this.attendeeService.getAttendees();
        }
    }

    @Put('/:id/courses')
    public async setCourses(
        @PathParams('id') id: number,
        @QueryParams('token') token: string,
        @BodyParams() courses: number[]
    ): Promise<Attendee> {
        const attendee = await this.attendeeService.getAttendeeById(id);

        if (attendee.token !== token) {
            throw new Unauthorized("Invalid or missing token");
        }

        await this.attendeeService.setAttendeesCourses(
            attendee,
            courses
        );

        return this.attendeeService.getAttendeeById(id, true);
    }
}
