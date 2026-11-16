import { Component, computed, input, model } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { ContextWithProjects } from 'src/app/projects/context-with-projects.model';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import {
  EXPERIENCE_KINDS,
  ExperienceKind,
  experienceKind,
} from '../experience-kind.model';

/**
 * Chips above the path of the experience page: every step, the jobs and internships, or the
 * schools, each with the number of steps it shows. One kind at most, "all" being pressed when none
 * is selected.
 */
@Component({
  selector: 'app-experience-filtering',
  imports: [MatIcon, TranslocoPipe],
  templateUrl: './experience-filtering.component.html',
  styleUrl: './experience-filtering.component.scss',
  hostDirectives: [GridItemDirective],
})
export class ExperienceFilteringComponent {
  /**
   * Every step of the path, filtered or not
   */
  public readonly contexts = input.required<Array<ContextWithProjects>>();

  /**
   * Kind of the steps shown, null for all of them
   */
  public readonly selectedKind = model<ExperienceKind | null>(null);

  /**
   * Chips after the "all" one: their kind, icon and number of steps
   */
  protected readonly kinds = computed(() =>
    EXPERIENCE_KINDS.map(kind => ({
      kind,
      icon: kind === 'school' ? 'school' : 'work',
      count: this.contexts().filter(context => experienceKind(context) === kind)
        .length,
    }))
  );
}
