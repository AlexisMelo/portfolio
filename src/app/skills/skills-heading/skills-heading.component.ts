import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { CountTitleComponent } from 'src/app/shared/count-title/count-title.component';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

/**
 * Title tile of the skills page
 */
@Component({
  selector: 'app-skills-heading',
  imports: [CountTitleComponent, TranslocoPipe],
  templateUrl: './skills-heading.component.html',
  styleUrl: './skills-heading.component.scss',
  host: { class: 'g-grid-item-highlight' },
  hostDirectives: [GridItemDirective],
})
export class SkillsHeadingComponent {
  /**
   * Number of skills, 0 until they are loaded
   */
  public readonly count = input.required<number>();

  /**
   * Year the first project started, null until the projects are loaded; the title waits for it so
   * that the words don't jump when it arrives
   */
  public readonly year = input.required<number | null>();
}
