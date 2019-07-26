import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {CourselistComponent} from './components/courselist/courselist.component';
import {TokenlistComponent} from './components/tokenlist/tokenlist.component';


const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'courses',
        component: CourselistComponent,
    },
    {
        path: 'tokens',
        component: TokenlistComponent,
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
