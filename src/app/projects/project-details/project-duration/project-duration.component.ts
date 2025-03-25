import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, Input, LOCALE_ID } from '@angular/core';
import { GridItemDirective } from 'src/app/contact/grid-item.directive';
import { RightArrowComponent } from 'src/app/landing-page/timeline/right-arrow/right-arrow.component';
import { ContentService } from 'src/app/shared/content.service';
import { KebabCasePipe } from 'src/app/shared/pipes/kebab-case.pipe';
import { DurationPipe } from '../../duration.pipe';
import { Project } from '../../project.model';
import { StatusPipe } from '../../status/status.pipe';
import { DotColor } from 'src/app/shared/dot/dot-color.model';
import { DotComponent } from 'src/app/shared/dot/dot.component';

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
    DotComponent,
  ],
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

  /**
   * Obtient le statut d'un projet
   */
  private statusPipe = inject(StatusPipe);

  /**
   * Couleur du point
   */
  get dotColor(): DotColor {
    switch (this.statusPipe.transform(this.project)) {
      case 'Abandonné':
        return 'red';
      case 'En cours':
        return 'orange';
      case 'Terminé':
        return 'green';
    }
  }
}
