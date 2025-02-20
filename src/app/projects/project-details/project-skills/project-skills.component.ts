import { Component, Input } from '@angular/core';
import { Project } from '../../project.model';
import { GridItemDirective } from 'src/app/contact/grid-item.directive';

@Component({
  selector: 'app-project-skills',
  standalone: true,
  imports: [],
  templateUrl: './project-skills.component.html',
  styleUrl: './project-skills.component.scss',
})
export class ProjectSkillsComponent extends GridItemDirective {
  /**
   * Projet à afficher
   */
  @Input({ required: true }) project!: Project;
}
