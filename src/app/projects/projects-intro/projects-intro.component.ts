import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

/**
 * Tile under the title of the projects page, introducing the projects: a coloured label and the
 * text under it, with the avatar shrugging on their right
 */
@Component({
  selector: 'app-projects-intro',
  imports: [TranslocoPipe, NgOptimizedImage],
  templateUrl: './projects-intro.component.html',
  styleUrl: './projects-intro.component.scss',
  hostDirectives: [GridItemDirective],
})
export class ProjectsIntroComponent {}
