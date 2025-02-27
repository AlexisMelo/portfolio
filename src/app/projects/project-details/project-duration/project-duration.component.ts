import { Component, Input, LOCALE_ID } from '@angular/core';
import { Project } from '../../project.model';
import { GridItemDirective } from 'src/app/contact/grid-item.directive';
import { StatusPipe } from '../../status/status.pipe';
import { DurationPipe } from '../../duration.pipe';
import { DatePipe, NgClass } from '@angular/common';
import { RightArrowComponent } from 'src/app/landing-page/timeline/right-arrow/right-arrow.component';
import { KebabCasePipe } from 'src/app/shared/pipes/kebab-case.pipe';
import { ContentService } from 'src/app/shared/content.service';

@Component({
  selector: 'app-project-duration',
  standalone: true,
  imports: [
    StatusPipe,
    DurationPipe,
    DatePipe,
    RightArrowComponent,
    NgClass,
    KebabCasePipe,
  ],
  templateUrl: './project-duration.component.html',
  styleUrl: './project-duration.component.scss',
  host: { class: 'g-start-aligned' },
  providers: [
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
