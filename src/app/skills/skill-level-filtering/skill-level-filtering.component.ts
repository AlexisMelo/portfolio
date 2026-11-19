import { Component, model } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { Constants, Enums } from 'database.types';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

/**
 * Chips of the skills page
 */
@Component({
  selector: 'app-skill-level-filtering',
  imports: [TranslocoPipe],
  templateUrl: './skill-level-filtering.component.html',
  styleUrl: './skill-level-filtering.component.scss',
  hostDirectives: [GridItemDirective],
})
export class SkillLevelFilteringComponent {
  /**
   * Mastery level of the skills shown, null for all of them
   */
  public readonly selectedLevel = model<Enums<'skill_level'> | null>(null);

  /**
   * Levels of the chips after the "all" one, from the best known to the least
   */
  protected readonly levels = Constants.public.Enums.skill_level;
}
