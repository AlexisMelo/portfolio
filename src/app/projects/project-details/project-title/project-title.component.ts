import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { Project } from '../../project.model';

/**
 * Heading tile of the project page: the project's logo and its name
 */
@Component({
  selector: 'app-project-title',
  imports: [NgOptimizedImage, TranslocoPipe],
  templateUrl: './project-title.component.html',
  styleUrl: './project-title.component.scss',
  hostDirectives: [GridItemDirective],
  host: { class: 'g-grid-item-highlight' },
})
export class ProjectTitleComponent {
  /**
   * Project to display
   */
  public readonly project = input.required<Project>();
}
