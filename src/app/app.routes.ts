import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {
  RELATIVE_ARCHIVES_ROUTE,
  RELATIVE_EXPERIENCE_ROUTE,
  RELATIVE_PROJECTS_ROUTE,
} from './route-paths';

// The landing page is eager, the other pages are loaded on navigation
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: RELATIVE_PROJECTS_ROUTE,
    loadComponent: () =>
      import('./projects/projects.component').then(m => m.ProjectsComponent),
  },
  {
    path: RELATIVE_ARCHIVES_ROUTE,
    loadComponent: () =>
      import('./projects/archives/archives.component').then(
        m => m.ArchivesComponent
      ),
  },
  {
    path: 'skills',
    loadComponent: () =>
      import('./skills/skills.component').then(m => m.SkillsComponent),
  },
  {
    path: RELATIVE_EXPERIENCE_ROUTE,
    loadComponent: () =>
      import('./experience/experience.component').then(
        m => m.ExperienceComponent
      ),
  },
  {
    path: RELATIVE_PROJECTS_ROUTE + '/:url',
    loadComponent: () =>
      import('./projects/project-details/project-details.component').then(
        m => m.ProjectDetailsComponent
      ),
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
