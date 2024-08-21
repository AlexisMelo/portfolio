import { Component, OnInit } from '@angular/core';
import { Project } from './project.model';
import { ProjectComponent } from "./project/project.component";
import { ProjectsService } from './projects.service';
 
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  /**
   * Liste des projets réalisés
   */
  public projects: Array<Project> = [];

  /**
   * Constructeur
   * @param projectService 
   */
  constructor(private projectService: ProjectsService) {}

  /**
   * Implémentation de OnInit
   */
  ngOnInit() {
    this.projectService.getProjects().then((projects) => this.projects = projects);
  }
}
