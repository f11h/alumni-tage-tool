import {Component, OnInit} from '@angular/core';
import {Course} from '@backend/Course';
import {SharedService} from '../../services/shared.service';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-courselist',
    templateUrl: './courselist.component.html',
    styleUrls: ['./courselist.component.scss']
})
export class CourselistComponent implements OnInit {

    public courses: Course[];
    public selectedCourse: Course;

    constructor(
        private shared: SharedService,
        private http: HttpClient
    ) {
    }

    async ngOnInit() {
        this.courses = await this.http.get<Course[]>(
            this.shared.buildApiUrl('courses'),
            {params: {auth: prompt('Auth Key?', ''), withAttendees: 'true'}}
        ).toPromise();
    }

}
