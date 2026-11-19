import { Component, computed, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { ProjectsService } from '../projects.service';
import { Status } from '../status/status.model';
import { getProjectStatus } from '../status/status.pipe';

/**
 * Bar of a status: how many shown projects have it, and the share of every project they fill
 */
interface StatusBar {
  /** Status of the bar */
  status: Status;

  /** Number of shown projects with this status */
  count: number;

  /** Filled length of the bar, in percent of every project */
  fill: number;
}

/**
 * Tile filtering the projects by status: one full-width progress bar per status, with a tag naming
 * it stuck over its end. A bar's full length is every project and its filled length the shown
 * projects of its status, their count written right after the fill, so the three counts add up to
 * the project counter. Bars and tags are in the colours of the numbers in the list. One status at
 * most, the other bars faded while it is selected: pressing it again shows every project.
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
   * Statuses of the bars, in display order
   */
  private readonly statuses: ReadonlyArray<Status> = [
    'completed',
    'ongoing',
    'abandoned',
  ];

  /**
   * Number of every project, the full length of the bars
   */
  protected readonly total = computed(
    () => this.projectsService.projects().length
  );

  /**
   * Bars, in display order
   */
  protected readonly bars = computed<Array<StatusBar>>(() => {
    const total = this.total();
    const counts: Record<Status, number> = {
      completed: 0,
      ongoing: 0,
      abandoned: 0,
    };

    for (const project of this.projectsService.selectedProjects()) {
      counts[getProjectStatus(project)]++;
    }

    return this.statuses.map(status => ({
      status,
      count: counts[status],
      fill: total === 0 ? 0 : (counts[status] / total) * 100,
    }));
  });

  /**
   * Selects a status, or shows every status again when it is already selected
   * @param status status of the pressed bar
   */
  protected toggle(status: Status) {
    this.projectsService.selectStatus(
      this.projectsService.selectedStatus() === status ? null : status
    );
  }
}
