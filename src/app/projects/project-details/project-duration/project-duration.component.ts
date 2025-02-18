import { Component, Input } from '@angular/core';
import { Project } from '../../project.model';
import { GridItemDirective } from 'src/app/contact/grid-item.directive';
import { StatusPipe } from '../../status/status.pipe';
import { DurationPipe } from '../../duration.pipe';
import { DatePipe, NgClass } from '@angular/common';
import { RightArrowComponent } from 'src/app/landing-page/timeline/right-arrow/right-arrow.component';
import { KebabCasePipe } from 'src/app/shared/pipes/kebab-case.pipe';

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
})
export class ProjectDurationComponent extends GridItemDirective {
  /**
   * Projet à afficher
   */
  @Input({ required: true }) project!: Project;
}
