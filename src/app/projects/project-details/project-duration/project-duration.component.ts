import { DatePipe, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
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
  providers: [StatusPipe],
})
export class ProjectDurationComponent extends GridItemDirective {
  /**
   * Projet à afficher
   */
  @Input({ required: true }) project!: Project;
}
