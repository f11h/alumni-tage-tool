import {Constant, Controller, Get, QueryParams} from '@tsed/common';
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
}
