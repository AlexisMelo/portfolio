import { Component, inject } from '@angular/core';
import { gridItemAnimation } from 'src/app/shared/animations';
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
  ],
  templateUrl: './archives.component.html',
  styleUrl: './archives.component.scss',
  providers: [IsSelectedPipe, StatusPipe, ArchivesService],
  animations: [gridItemAnimation],
})
export class ArchivesComponent {
  /**
   * Handle data related to archives
   */
  public archivesService = inject(ArchivesService);
}
