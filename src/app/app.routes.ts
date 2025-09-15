import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArchivesComponent } from './projects/archives/archives.component';
import { ProjectDetailsComponent } from './projects/project-details/project-details.component';
import { ProjectsComponent } from './projects/projects.component';
import { SkillsComponent } from './skills/skills.component';
import { ExperienceComponent } from './experience/experience.component';

const RELATIVE_ARCHIVES_ROUTE = 'projects/archives';
export const ARCHIVES_ROUTE = '/' + RELATIVE_ARCHIVES_ROUTE;

const RELATIVE_EXPERIENCE_ROUTE = 'experience';
export const EXPERIENCE_ROUTE = '/' + RELATIVE_EXPERIENCE_ROUTE;

const RELATIVE_PROJECTS_ROUTE = 'projects';
export const PROJECTS_ROUTE = '/' + RELATIVE_PROJECTS_ROUTE;

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
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
    path: 'experience',
    component: ExperienceComponent,
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
