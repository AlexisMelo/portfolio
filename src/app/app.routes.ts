import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {
  RELATIVE_EXPERIENCE_ROUTE,
  RELATIVE_LEGAL_ROUTE,
  RELATIVE_PROJECTS_ROUTE,
  RELATIVE_SKILLS_ROUTE,
} from './route-paths';
import { DESCRIPTION_KEY } from './shared/page-title.strategy';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'navbar.about',
    data: { [DESCRIPTION_KEY]: 'seo.about' },
  },
  {
    path: RELATIVE_PROJECTS_ROUTE,
    loadComponent: () =>
      import('./projects/projects.component').then(m => m.ProjectsComponent),
    title: 'navbar.projects',
    data: { [DESCRIPTION_KEY]: 'seo.projects' },
  },
  {
    path: RELATIVE_SKILLS_ROUTE,
    loadComponent: () =>
      import('./skills/skills.component').then(m => m.SkillsComponent),
    title: 'navbar.skills',
    data: { [DESCRIPTION_KEY]: 'seo.skills' },
  },
  {
    path: RELATIVE_EXPERIENCE_ROUTE,
    loadComponent: () =>
      import('./experience/experience.component').then(
        m => m.ExperienceComponent
      ),
    title: 'navbar.experience',
    data: { [DESCRIPTION_KEY]: 'seo.experience' },
  },
  {
    path: RELATIVE_PROJECTS_ROUTE + '/:url',
    loadComponent: () =>
      import('./projects/project-details/project-details.component').then(
        m => m.ProjectDetailsComponent
      ),
    // Replaced by the project's name once it is loaded
    title: 'navbar.projects',
    data: { [DESCRIPTION_KEY]: 'seo.projects' },
  },
  {
    path: RELATIVE_LEGAL_ROUTE,
    loadComponent: () => import('./legal/legal').then(m => m.Legal),
    title: 'legal.title',
    data: { [DESCRIPTION_KEY]: 'seo.legal' },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
