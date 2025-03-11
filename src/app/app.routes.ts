import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ProjectsComponent } from './projects/projects.component';
import { ContactComponent } from './contact/contact.component';
import { ProjectDetailsComponent } from './projects/project-details/project-details.component';
import { SkillsComponent } from './skills/skills.component';
import { ArchivesComponent } from './projects/archives/archives.component';

const RELATIVE_ARCHIVES_ROUTE = 'projects/archives';
export const ARCHIVES_ROUTE = '/' + RELATIVE_ARCHIVES_ROUTE;

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
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
    path: 'contact',
    component: ContactComponent,
  },
];
