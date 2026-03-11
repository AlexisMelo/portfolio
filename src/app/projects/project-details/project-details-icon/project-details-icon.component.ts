import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { Project } from '../../project.model';

@Component({
  selector: 'app-project-details-icon',
  imports: [NgOptimizedImage, TranslocoPipe],
  templateUrl: './project-details-icon.component.html',
  styleUrl: './project-details-icon.component.scss',
})
export class ProjectDetailsIconComponent extends GridItemDirective {
  /**
   * Projet à afficher
   */
  @Input({ required: true }) project!: Project;
}
