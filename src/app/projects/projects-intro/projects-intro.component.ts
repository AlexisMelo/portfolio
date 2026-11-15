import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

/**
 * Speech bubble of the projects page: what the avatar of the tile on its right says about the
 * projects, between big quote marks
 */
@Component({
  selector: 'app-projects-intro',
  imports: [TranslocoPipe],
  templateUrl: './projects-intro.component.html',
  styleUrl: './projects-intro.component.scss',
  hostDirectives: [GridItemDirective],
})
export class ProjectsIntroComponent {}
