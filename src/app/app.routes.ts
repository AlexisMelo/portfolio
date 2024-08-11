import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ProjectsComponent } from './projects/projects.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
    {
        path: '', component: LandingPageComponent
    },
    {
        path: 'projects', component: ProjectsComponent
    },
    {
        path: 'contact', component: ContactComponent
    },
];
