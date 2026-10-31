import { Component, computed, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  gridItemAnimation,
  replayGridItemAnimation,
} from 'src/app/shared/animations';
import { IsSelectedPipe } from 'src/app/shared/is-selected/is-selected.pipe';
import { SkillSectionDescriptionComponent } from '../../skills/skill-section-description/skill-section-description.component';
import { OrderComponent } from '../order/order.component';
import { ProjectCondensedItemComponent } from '../project-item/project-item-condensed/project-item-condensed.component';
import { StatusPipe } from '../status/status.pipe';
import { ArchivesService } from './archives.service';
import { KeyHeaderComponent } from './key-header/key-header.component';
import { ProjectCounterComponent } from './project-counter/project-counter.component';
import { ProjectFilteringComponent } from './project-filtering/project-filtering.component';
import { StatusFilteringComponent } from './status-filtering/status-filtering.component';

@Component({
  selector: 'app-archives',
  imports: [
    SkillSectionDescriptionComponent,
    ProjectCounterComponent,
    ProjectCondensedItemComponent,
    ProjectFilteringComponent,
    StatusFilteringComponent,
    OrderComponent,
    KeyHeaderComponent,
    TranslocoPipe,
  ],
  templateUrl: './archives.component.html',
  styleUrl: './archives.component.scss',
  providers: [IsSelectedPipe, StatusPipe, ArchivesService],
  animations: [
    gridItemAnimation,
    replayGridItemAnimation('app-key-header, app-project-item-condensed'),
  ],
})
export class ArchivesComponent {
  /**
   * Handle data related to archives
   */
  public archivesService = inject(ArchivesService);

  /**
   * Ids of the displayed projects in display order, changes each time the results are re-rendered
   */
  protected readonly resultsKey = computed(() =>
    this.archivesService
      .sortedGroupedProjects()
      .flatMap(group => group.projects.map(project => project.id))
      .join()
  );
}
