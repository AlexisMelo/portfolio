import { Component, inject } from '@angular/core';
import { IsSelectedPipe } from 'src/app/shared/is-selected/is-selected.pipe';
import { SkillSectionDescriptionComponent } from '../../skills/skill-section-description/skill-section-description.component';
import { ProjectCondensedItemComponent } from '../project-item/project-item-condensed/project-item-condensed.component';
import { StatusPipe } from '../status/status.pipe';
import { ArchivesService } from './archives.service';
import { ProjectCounterComponent } from './project-counter/project-counter.component';
import { ProjectFilteringComponent } from './project-filtering/project-filtering.component';
import { StatusFilteringComponent } from './status-filtering/status-filtering.component';

@Component({
  selector: 'app-archives',
  standalone: true,
  imports: [
    SkillSectionDescriptionComponent,
    ProjectCounterComponent,
    ProjectCondensedItemComponent,
    ProjectFilteringComponent,
    StatusFilteringComponent,
  ],
  templateUrl: './archives.component.html',
  styleUrl: './archives.component.scss',
  providers: [IsSelectedPipe, StatusPipe, ArchivesService],
})
export class ArchivesComponent {
  /**
   * Handle data related to archives
   */
  public archivesService = inject(ArchivesService);
}
