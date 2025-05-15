import { Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { ArchivesComponent } from './projects/archives/archives.component';
import { ProjectDetailsComponent } from './projects/project-details/project-details.component';
import { ProjectsComponent } from './projects/projects.component';
import { SkillsComponent } from './skills/skills.component';

const RELATIVE_ARCHIVES_ROUTE = 'projects/archives';
export const ARCHIVES_ROUTE = '/' + RELATIVE_ARCHIVES_ROUTE;

export const routes: Routes = [
  {
    path: '',
    component: ContactComponent,
  },
  {
    path: 'projects',
    component: ProjectsComponent,
  },
  {
    path: RELATIVE_ARCHIVES_ROUTE,
    component: ArchivesComponent,
  },
  {
    path: 'skills',
    component: SkillsComponent,
  },
  {
    path: 'projects/:url',
    component: ProjectDetailsComponent,
  },
  {
    path: 'now',
    redirectTo: '',
  },
  //https://v17.angular.io/guide/router#setting-up-wildcard-routes
  {
    path: '**',
    redirectTo: '',
  },
];
