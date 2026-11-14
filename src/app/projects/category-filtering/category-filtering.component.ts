import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import {
  ALL_CATEGORIES_CHIP_ID,
  PROJECT_CATEGORIES,
} from '../project-category.model';
import { ProjectsService } from '../projects.service';

/**
 * Tile of chips above the project list: every project, then the featured, Angular, company and
 * personal ones. One category at most, "all" being pressed when none is selected.
 */
@Component({
  selector: 'app-category-filtering',
  imports: [TranslocoPipe],
  templateUrl: './category-filtering.component.html',
  styleUrl: './category-filtering.component.scss',
  hostDirectives: [GridItemDirective],
})
export class CategoryFilteringComponent {
  /**
   * Projects, filters and their results
   */
  protected readonly projectsService = inject(ProjectsService);

  /**
   * Categories of the chips after the "all" one, in display order
   */
  protected readonly categories = PROJECT_CATEGORIES;

  /**
   * Id of the "all" chip
   */
  protected readonly allChipId = ALL_CATEGORIES_CHIP_ID;
}
