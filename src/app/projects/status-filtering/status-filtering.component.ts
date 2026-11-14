import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { ProjectsService } from '../projects.service';
import { Status } from '../status/status.model';

/**
 * Tile filtering the projects by status, a title above a line of chips like the search tile. Each
 * chip has a dot in the colour of its status, the colour of the numbers in the list. One status at
 * most: pressing the selected one shows every project again.
 */
@Component({
  selector: 'app-status-filtering',
  imports: [TranslocoPipe],
  templateUrl: './status-filtering.component.html',
  styleUrl: './status-filtering.component.scss',
  hostDirectives: [GridItemDirective],
})
export class StatusFilteringComponent {
  /**
   * Projects, filters and their results
   */
  protected readonly projectsService = inject(ProjectsService);

  /**
   * Statuses of the chips, in display order
   */
  protected readonly statuses: ReadonlyArray<Status> = [
    'completed',
    'ongoing',
    'abandoned',
  ];

  /**
   * Id of the title, which labels the group of chips
   */
  protected readonly titleId = 'projects-status-title';

  /**
   * Selects a status, or shows every status again when it is already selected
   * @param status status of the pressed chip
   */
  protected toggle(status: Status) {
    this.projectsService.selectStatus(
      this.projectsService.selectedStatus() === status ? null : status
    );
  }
}
