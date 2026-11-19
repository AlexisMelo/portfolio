import { Component, computed, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ActionButtonComponent } from 'src/app/home/action-button/action-button.component';
import { CountTitleComponent } from 'src/app/shared/count-title/count-title.component';
import { firstStartYear } from 'src/app/shared/first-start-year';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { ProjectsService } from '../projects.service';

/**
 * Title tile of the projects page, in mustard (the accent): how many projects there are and the
 * year the first one started. When the filters hide some projects, the number and the year count to
 * those of the shown projects, and a badge gives the total. While a filter is applied, a button
 * clears them.
 */
@Component({
  selector: 'app-projects-heading',
  imports: [ActionButtonComponent, CountTitleComponent, TranslocoPipe],
  templateUrl: './projects-heading.component.html',
  styleUrl: './projects-heading.component.scss',
  host: { class: 'g-grid-item-highlight' },
  hostDirectives: [GridItemDirective],
})
export class ProjectsHeadingComponent {
  /**
   * Projects, filters and their results
   */
  protected readonly projectsService = inject(ProjectsService);

  /**
   * Number of every project
   */
  protected readonly total = computed(
    () => this.projectsService.projects().length
  );

  /**
   * Number of the projects the filters show
   */
  protected readonly count = computed(
    () => this.projectsService.selectedProjects().length
  );

  /**
   * Year the first project started
   */
  protected readonly firstYear = computed(() =>
    firstStartYear(this.projectsService.projects())
  );

  /**
   * Year the first shown project started, the first year of all when none is shown
   */
  protected readonly shownYear = computed(
    () =>
      firstStartYear(this.projectsService.selectedProjects()) ??
      this.firstYear()
  );
}
