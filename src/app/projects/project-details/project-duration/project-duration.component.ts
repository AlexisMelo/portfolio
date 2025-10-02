import { DatePipe, NgClass } from '@angular/common';
import { Component, Input, LOCALE_ID } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ContentService } from 'src/app/shared/content.service';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { DurationPipe } from '../../duration.pipe';
import { Project } from '../../project.model';
import { StatusPipe } from '../../status/status.pipe';

@Component({
  selector: 'app-project-duration',
  standalone: true,
  imports: [StatusPipe, DurationPipe, DatePipe, MatIconModule, NgClass],
  templateUrl: './project-duration.component.html',
  styleUrl: './project-duration.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
  providers: [
    StatusPipe,
    {
      provide: LOCALE_ID,
      deps: [ContentService],
      useFactory: (contentService: ContentService) => {
        return contentService.locale;
      },
    },
  ],
})
export class ProjectDurationComponent extends GridItemDirective {
  /**
   * Projet à afficher
   */
  @Input({ required: true }) project!: Project;
}
