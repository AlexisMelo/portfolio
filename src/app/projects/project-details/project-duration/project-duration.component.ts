import { Component, Input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { DurationPipe } from '../../duration.pipe';
import { Project } from '../../project.model';
import { StatusPipe } from '../../status/status.pipe';

/**
 * Tile of how long the project lasted, when it started and its status
 */
@Component({
  selector: 'app-project-duration',
  imports: [StatusPipe, DurationPipe, TranslocoPipe, TranslocoDatePipe],
  templateUrl: './project-duration.component.html',
  styleUrl: './project-duration.component.scss',
})
export class ProjectDurationComponent extends GridItemDirective {
  /**
   * Projet à afficher
   */
  @Input({ required: true }) project!: Project;
}
