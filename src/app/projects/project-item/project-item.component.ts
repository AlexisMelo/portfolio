import { Component, Input } from '@angular/core';
import { Project } from '../project.model';
import { RightArrowComponent } from '../../landing-page/timeline/right-arrow/right-arrow.component';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-project-item',
  standalone: true,
  imports: [RightArrowComponent, DatePipe, MatIcon],
  templateUrl: './project-item.component.html',
  styleUrl: './project-item.component.scss',
})
export class ProjectItemComponent {
  /**
   * Project to display
   */
  @Input({ required: true }) project!: Project;
}
