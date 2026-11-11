import { Component, computed, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GithubComponent } from 'src/app/home/github/github.component';
import { ContentService } from 'src/app/shared/content.service';
import { GridEntranceDirective } from 'src/app/shared/grid/grid-entrance.directive';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { IsSelectedPipe } from 'src/app/shared/is-selected/is-selected.pipe';
import { SkillSectionDescriptionComponent } from '../skills/skill-section-description/skill-section-description.component';
import { KeyHeaderComponent } from './key-header/key-header.component';
import { OngoingComponent } from './ongoing/ongoing.component';
import { OrderComponent } from './order/order.component';
import { ProjectCounterComponent } from './project-counter/project-counter.component';
import { ProjectFilteringComponent } from './project-filtering/project-filtering.component';
import { ProjectCondensedItemComponent } from './project-item/project-item-condensed/project-item-condensed.component';
import { ProjectsService } from './projects.service';
import { StatusFilteringComponent } from './status-filtering/status-filtering.component';
import { StatusPipe } from './status/status.pipe';
import { WithSkillComponent } from './with-skill/with-skill.component';
import { YourProjectComponent } from './your-project/your-project.component';

/**
 * Projects page: every project, with filters, grouped by end year
 */
@Component({
  selector: 'app-projects',
  imports: [
    SkillSectionDescriptionComponent,
    ProjectCounterComponent,
    ProjectCondensedItemComponent,
    ProjectFilteringComponent,
    StatusFilteringComponent,
    OrderComponent,
    KeyHeaderComponent,
    YourProjectComponent,
    OngoingComponent,
    WithSkillComponent,
    GithubComponent,
    TranslocoPipe,
    GridItemDirective,
    GridEntranceDirective,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  providers: [IsSelectedPipe, StatusPipe, ProjectsService],
})
export class ProjectsComponent {
  /**
   * Projects, filters and their results
   */
  public projectsService = inject(ProjectsService);

  /**
   * Content of the site, for the GitHub link
   */
  protected contentService = inject(ContentService);

  /**
   * Ids of the displayed projects in display order, changes each time the results are re-rendered
   */
  protected readonly resultsKey = computed(() =>
    this.projectsService
      .sortedGroupedProjects()
      .flatMap(group => group.projects.map(project => project.id))
      .join()
  );
}
