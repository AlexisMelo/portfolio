import { Component, Input } from '@angular/core';
import { Project } from '../../project.model';
import { GridItemDirective } from 'src/app/contact/grid-item.directive';

@Component({
  selector: 'app-project-problematic',
  standalone: true,
  imports: [],
  templateUrl: './project-problematic.component.html',
  styleUrl: './project-problematic.component.scss',
  host: { class: 'g-start-aligned' },
})
export class ProjectProblematicComponent extends GridItemDirective {
  /**
   * Projet à afficher
   */
  @Input({ required: true }) project!: Project;
}
