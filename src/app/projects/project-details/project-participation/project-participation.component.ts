import { Component, Input } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { Project } from '../../project.model';

@Component({
  selector: 'app-project-participation',
  imports: [],
  templateUrl: './project-participation.component.html',
  styleUrl: './project-participation.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class ProjectParticipationComponent extends GridItemDirective {
  /**
   * Projet à afficher
   */
  @Input({ required: true }) project!: Project;
}
