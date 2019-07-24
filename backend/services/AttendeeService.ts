import {Injectable} from '@tsed/di';
import {TypeORMService} from '@tsed/typeorm';
import {Repository} from 'typeorm';
import {OnServerReady} from '@tsed/common';
import {Attendee} from '../model/Attendee';

@Injectable()
export class AttendeeService implements OnServerReady {
    private repo: Repository<Attendee>;

    public constructor(
        private orm: TypeORMService,
    ) {
    }

    $onServerReady(): void | Promise<any> {
        this.repo = this.orm.get('default').getRepository(Attendee);
    }

    public getAttendees(): Promise<Attendee[]> {
        return this.repo.find({relations: ['courses']});
    }

    public getAttendeeByToken(token: string): Promise<Attendee> {
        return this.repo.findOne({where: {token}, relations: ['courses']});
    }
}
