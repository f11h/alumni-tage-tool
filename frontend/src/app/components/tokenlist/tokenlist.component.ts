import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../services/shared.service';
import {HttpClient} from '@angular/common/http';
import {Attendee} from '@backend/Attendee';

@Component({
    selector: 'app-tokenlist',
    templateUrl: './tokenlist.component.html',
    styleUrls: ['./tokenlist.component.scss']
})
export class TokenlistComponent implements OnInit {

    public attendees: Attendee[] = [];

    constructor(
        private shared: SharedService,
        private http: HttpClient
    ) {
    }

    async ngOnInit() {
        this.attendees = await this.http.get<Attendee[]>(
            this.shared.buildApiUrl('attendees'),
            {params: {auth: prompt('Auth Key?', '')}}
        ).toPromise();

        this.attendees = this.attendees.filter(a => a.courses.length === 0 && a.name === null)
    }

    getQrCodeUrl(attendee: Attendee) {
        return 'https://tools.alumni-lenne.de/att/#?token=' + btoa(this.capitalizeString(attendee.token));
    }

    public capitalizeString(inp: string): string {
        return inp.split(" ")
            .map(s => s[0].toUpperCase() + s.slice(1))
            .join(" ");
    }
}
