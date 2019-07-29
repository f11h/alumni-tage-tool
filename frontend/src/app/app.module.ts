import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import {
    MatButtonModule, MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSnackBarModule,
    MatStepperModule,
    MatToolbarModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { HttpClientModule } from '@angular/common/http';
import { CourselistComponent } from './components/courselist/courselist.component';
import { TokenlistComponent } from './components/tokenlist/tokenlist.component';
import { QRCodeModule } from 'angularx-qrcode';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        CourselistComponent,
        TokenlistComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatStepperModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        HttpClientModule,
        MatGridListModule,
        MatExpansionModule,
        MatRadioModule,
        MatDividerModule,
        MatSnackBarModule,
        MatSelectModule,
        QRCodeModule,
    ],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { displayDefaultIndicatorType: false },
        },
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy,
        },
    ],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {
}
