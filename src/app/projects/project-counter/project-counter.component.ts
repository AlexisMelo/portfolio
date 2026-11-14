import { Component, computed, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ActionButtonComponent } from 'src/app/home/action-button/action-button.component';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { ProjectsService } from '../projects.service';

/**
 * Tile counting the projects the filters show out of every project, with a button clearing the
 * filters while some are hidden
 */
@Component({
  selector: 'app-project-counter',
  imports: [ActionButtonComponent, TranslocoPipe],
  templateUrl: './project-counter.component.html',
  styleUrl: './project-counter.component.scss',
})
export class ProjectCounterComponent extends GridItemDirective {
  /**
   * Projects, filters and their results
   */
  protected readonly projectsService = inject(ProjectsService);

  /**
   * Count of projects
   */
  public readonly count = computed(
    () => this.projectsService.selectedProjects().length
  );

  /**
   * Total projects
   */
  public readonly total = computed(
    () => this.projectsService.projects().length
  );
}
