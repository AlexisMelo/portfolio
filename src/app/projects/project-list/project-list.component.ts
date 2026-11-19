import { Component, computed, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ActionButtonComponent } from 'src/app/home/action-button/action-button.component';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LoaderComponent } from 'src/app/shared/loader/loader.component';
import { NumberedProject } from '../listed-project.model';
import { ProjectRowComponent } from '../project-row/project-row.component';
import { ProjectsService } from '../projects.service';
import { YourProjectComponent } from '../your-project/your-project.component';

/**
 * Position of the "your project here" entry in the list, when there are enough projects before it
 */
const YOUR_PROJECT_INDEX = 2;

/**
 * Number of grid rows the list takes while the projects load
 */
const LOADING_ROWS = 4;

/**
 * Entry of the list: a project, the "your project here" invitation, or the message shown when no
 * project matches the filters
 */
type ListEntry =
  | { kind: 'project'; key: string; numbered: NumberedProject }
  | { kind: 'yourProject'; key: string }
  | { kind: 'empty'; key: string };

/**
 * Tile listing the selected projects, the most recent first, with the "your project here" entry in
 * third position (left out among the abandoned projects). On medium screens and up, one row per
 * project, each one grid row high; on phones,
 * the tile disappears behind its entries, which are cards two grid rows high. The tile spans the
 * grid rows its entries need.
 */
@Component({
  selector: 'app-project-list',
  imports: [
    ActionButtonComponent,
    ProjectRowComponent,
    YourProjectComponent,
    LoaderComponent,
    TranslocoPipe,
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
  hostDirectives: [GridItemDirective],
  host: {
    '[style.--project-list-rows]': 'rows()',
    '[style.--project-list-card-rows]': 'rows() * 2',
  },
})
export class ProjectListComponent {
  /**
   * Projects, filters and their results
   */
  protected readonly projectsService = inject(ProjectsService);

  /**
   * Entries of the list. Their keys change with the results, so that every entry is rendered again
   * and enters again, one after another, each time the filters change.
   */
  protected readonly entries = computed<ListEntry[]>(() => {
    const projects = this.projectsService.listedProjects();
    const resultsKey = projects.map(({ project }) => project.id).join();

    const entries: ListEntry[] = projects.map(numbered => ({
      kind: 'project',
      key: `${resultsKey}|${numbered.project.id}`,
      numbered,
    }));

    if (projects.length === 0) {
      entries.push({ kind: 'empty', key: `${resultsKey}|empty` });
    }

    // Among the abandoned projects, an invitation to bring the next one would read badly
    if (this.projectsService.selectedStatus() !== 'abandoned') {
      entries.splice(Math.min(YOUR_PROJECT_INDEX, entries.length), 0, {
        kind: 'yourProject',
        key: `${resultsKey}|your-project`,
      });
    }

    return entries;
  });

  /**
   * Number of entries, which is the number of grid rows the tile spans (twice on phones)
   */
  protected readonly rows = computed(() =>
    this.projectsService.loaded() ? this.entries().length : LOADING_ROWS
  );

  /**
   * Number the visitor's project would get: the one after the last project
   */
  protected readonly nextNumber = computed(
    () => this.projectsService.projects().length + 1
  );
}
