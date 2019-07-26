import {BodyParams, Constant, Controller, Get, PathParams, Post, Put, QueryParams, Response} from '@tsed/common';
import {Unauthorized} from 'ts-httpexceptions';
import {Attendee} from '../model/Attendee';
import {AttendeeService} from '../services/AttendeeService';
import {TokenService} from '../services/TokenService';

@Controller('/attendees')
export class AttendeeController {

    @Constant('password')
    private readonly password: string;

    public constructor(
        private attendeeService: AttendeeService,
        private tokenService: TokenService,
    ) {
    }

    @Get('/')
    public async getAttendees(
        @QueryParams('token') token: string,
        @QueryParams('auth') auth: string,
    ): Promise<Attendee[]> {
        if (token) {
            const attendee = await this.attendeeService.getAttendeeByToken(token);
            return attendee ? [attendee] : [];
        } else {
            if (auth !== this.password) throw(new Unauthorized(''));

            return await this.attendeeService.getAttendees();
        }
    }

    @Post('/')
    public async createAttendees(
        @QueryParams('auth') auth: string,
        @QueryParams('n') count: number,
        @Response() response: Response,
    ): Promise<Attendee[]> {
        if (auth !== this.password) throw new Unauthorized('');

        const createdAttendees: Attendee[] = [];
        const tokens: string[] = this.tokenService.generateUniqueTokens(count);

        for (const token of tokens) {
            createdAttendees.push(await this.attendeeService.createAttendee(new Attendee({
                courses: [],
                token,
            })));
        }

        response.status(201);
        return createdAttendees;
    }

    @Put('/:id/name')
    public async setName(
        @PathParams('id') id: number,
        @QueryParams('token') token: string,
        @BodyParams('name') name: string,
    ): Promise<Attendee> {
        const attendee = await this.attendeeService.getAttendeeById(id);
        if (attendee.token !== token) {
            throw new Unauthorized('Invalid or missing token');
        }
        attendee.name = name;
        return this.attendeeService.saveAttendee(attendee);
    }

    @Put('/:id/courses')
    public async setCourses(
        @PathParams('id') id: number,
        @QueryParams('token') token: string,
        @BodyParams() courses: number[],
    ): Promise<Attendee> {
        const attendee = await this.attendeeService.getAttendeeById(id);

        if (attendee.token !== token) {
            throw new Unauthorized('Invalid or missing token');
        }

        await this.attendeeService.setAttendeesCourses(
            attendee,
            courses,
        );

        return this.attendeeService.getAttendeeById(id, true);
    }
}
