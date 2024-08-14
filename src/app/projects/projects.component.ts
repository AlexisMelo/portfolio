import { Component } from '@angular/core';
import { Project } from './project.model';
import { ProjectComponent } from "./project/project.component";
 
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  public projects: Array<Project> = [{
    id: 1,
    title: 'MES_Infos',
    date: 2023,
    type: 'Site web',
    company: 'Bosch',
    description: 'Courte description à mettre ici pour qu’on capte vraiment l’intérêt du projet et qu’on se dise que je suis super intelligent, fort et beau'
  },
  {
    id: 2,
    title: 'MES_Infos',
    date: 2023,
    type: 'Site web',
    company: 'Bosch',
    description: 'Courte description à mettre ici pour qu’on capte vraiment l’intérêt du projet et qu’on se dise que je suis super intelligent, fort et beau'
  },
  {
    id: 3,
    title: 'MES_Infos',
    date: 2023,
    type: 'Site web',
    company: 'Bosch',
    description: 'Courte description à mettre ici pour qu’on capte vraiment l’intérêt du projet et qu’on se dise que je suis super intelligent, fort et beau'
  },
  {
    id: 4,
    title: 'MES_Infos',
    date: 2023,
    type: 'Site web',
    company: 'Bosch',
    description: 'Courte description à mettre ici pour qu’on capte vraiment l’intérêt du projet et qu’on se dise que je suis super intelligent, fort et beau'
  }];
}
