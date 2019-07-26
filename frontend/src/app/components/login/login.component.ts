import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {filter} from 'rxjs/operators';
import {MatSnackBar, MatStepper} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {SharedService} from '../../services/shared.service';
import {Attendee} from '@backend/Attendee';
import {Course} from '@backend/Course';
import {forkJoin} from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public loginForm: FormGroup = new FormGroup({
        token: new FormControl(null, [Validators.required]),
    });

    public nameForm: FormGroup = new FormGroup({
        name: new FormControl(null, [Validators.required]),
    });

    public selectedCourseForm = new FormGroup({
        '1': new FormControl(null, [Validators.required]),
        '2': new FormControl(null, [Validators.required]),
        '3': new FormControl(null, [Validators.required]),
    });

    public step1Completed = false;
    public step2Completed = false;
    public step3Completed = false;
    public loginInProgress = false;
    public saveNameInProgress = false;
    public submitCoursesInProgress = false;

    public name: string;

    public attendee: Attendee;

    public courses: Course[] = [];

    public doubleError: boolean = false;
    public sek2Error: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private changeDetector: ChangeDetectorRef,
        private http: HttpClient,
        private shared: SharedService,
        private snackbar: MatSnackBar,
    ) {
    }

    ngOnInit() {
        this.route.queryParams.pipe(
            filter(params => params.token)
        ).subscribe(params => {
            this.loginForm.get('token').setValue(atob(params.token));
        });

        this.selectedCourseForm.valueChanges.subscribe(() => this.checkSelectedCourses());
    }

    public login(el: MatStepper) {
        this.loginInProgress = true;

        forkJoin(
            this.http.get<Attendee[]>(this.shared.buildApiUrl('attendees'), {params: {token: this.loginForm.get('token').value}}),
            this.http.get<Course[]>(this.shared.buildApiUrl('courses'))
        ).subscribe(([attendees, courses]) => {
            if (attendees.length === 1) {
                this.snackbar.dismiss();

                this.attendee = attendees[0];
                this.nameForm.get('name').setValue(this.attendee.name);
                this.courses = courses;

                this.setCourses();
                if (this.attendee.courses.length > 0) {
                    this.selectedCourseForm.disable();
                }

                this.step1Completed = true;
                this.changeDetector.detectChanges();
                el.next();
            } else {
                this.snackbar.open('Zugangscode ist nicht korrekt.', 'Schließen', {horizontalPosition: 'right', verticalPosition: 'top'});
                this.loginInProgress = false;
                this.loginForm.reset();
            }
        }, error1 => {
            console.log('Error during http request:', error1);
        });
    }

    public async saveName(el: MatStepper) {
        this.saveNameInProgress = true;
        this.name = this.nameForm.get('name').value;

        await this.http.put<Course[]>(
            this.shared.buildApiUrl('attendees', this.attendee.id.toString(), 'name'),
            {name: this.name},
            {params: {token: this.attendee.token}}).toPromise();

        this.saveNameInProgress = false;

        this.step2Completed = true;
        this.changeDetector.detectChanges();
        el.next();
    }

    public filterCoursesByTimeslot(timeslot: number): Course[] {
        return this.courses.filter(c => c.timeSlot === timeslot);
    }

    private setCourses() {
        if (this.attendee && this.attendee.courses && this.attendee.courses.length > 0) {
            for (let i = 1; i <= 3; i++) {
                const courseId = this.attendee.courses.find(c => c.timeSlot === i).id;

                this.selectedCourseForm.get(i.toString()).setValue(
                    this.courses.find(c => c.id == courseId)
                );
            }
        }
    }

    private checkSelectedCourses() {
        if (this.selectedCourseForm.valid) {
            this.sek2Error = false;
            this.doubleError = false;

            const classes: string[] = [];
            const selectedCourses: Course[] = [];

            for (let i = 1; i <= 3; i++) selectedCourses.push(this.selectedCourseForm.get(i.toString()).value);

            // check: Only one course per class and only one course per timeslot
            // check: course not full
            for (const course of selectedCourses) {
                if (classes.includes(course.class)) {
                    this.doubleError = true;
                } else {
                    classes.push(course.class);
                }
            }

            // check: Sek2 course must be chosen
            if (!classes.includes('sek2')) {
                this.sek2Error = true;
            }
        }
    }

    public async submitCourses(deleteCourses?: boolean) {
        this.submitCoursesInProgress = true;

        const selectedCourseIds: number[] = [];
        if (!deleteCourses) for (let i = 1; i <= 3; i++) selectedCourseIds.push(this.selectedCourseForm.get(i.toString()).value.id);

        try {
            this.attendee = await this.http.put<Attendee>(
                this.shared.buildApiUrl('attendees', this.attendee.id.toString(), 'courses'),
                selectedCourseIds,
                {params: {token: this.attendee.token}}
            ).toPromise();

            this.courses = await this.http.get<Course[]>(this.shared.buildApiUrl('courses')).toPromise();

            this.setCourses();

            if (deleteCourses) {
                this.selectedCourseForm.reset();
                this.selectedCourseForm.enable();
            } else {
                this.selectedCourseForm.disable();
            }

            this.snackbar.open('Kursbelegung erfolgreich gespeichert.', 'Schließen', {verticalPosition: 'top', horizontalPosition: 'right'});
        } catch (e) {
            this.snackbar.open('Beim Speichern deiner Kursbelegung ist ein Fehler aufgetreten. Eventuell ist einer deiner Kurse zwischenzeitlich voll. Bitte versuche es erneut.', 'Schließen', {
                verticalPosition: 'top',
                horizontalPosition: 'right'
            });
            this.courses = await this.http.get<Course[]>(this.shared.buildApiUrl('courses')).toPromise();
            this.setCourses();
            this.selectedCourseForm.reset();
            this.selectedCourseForm.enable();
        }
        this.submitCoursesInProgress = false;
    }
}
