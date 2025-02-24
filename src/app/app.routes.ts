import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ProjectsComponent } from './projects/projects.component';
import { ContactComponent } from './contact/contact.component';
import { ProjectDetailsComponent } from './projects/project-details/project-details.component';
import { SkillsComponent } from './skills/skills.component';

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
