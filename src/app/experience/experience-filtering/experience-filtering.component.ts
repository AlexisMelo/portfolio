import { Component, model } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { EXPERIENCE_KINDS, ExperienceKind } from '../experience-kind.model';

/**
 * Chips above the path of the experience page
 */
@Component({
  selector: 'app-experience-filtering',
  imports: [TranslocoPipe],
  templateUrl: './experience-filtering.component.html',
  styleUrl: './experience-filtering.component.scss',
  hostDirectives: [GridItemDirective],
})
export class ExperienceFilteringComponent {
  /**
   * Kind of the steps shown, null for all of them
   */
  public readonly selectedKind = model<ExperienceKind | null>(null);

  /**
   * Kinds of the chips after the "all" one
   */
  protected readonly kinds = EXPERIENCE_KINDS;
}
