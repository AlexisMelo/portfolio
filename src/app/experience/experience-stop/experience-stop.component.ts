import { Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';
import { ContextWithProjects } from 'src/app/projects/context-with-projects.model';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { experienceKind } from '../experience-kind.model';

/**
 * Stop of the experience timeline, next to the card of its step
 */
@Component({
  selector: 'app-experience-stop',
  imports: [MatIcon, TranslocoDatePipe, TranslocoPipe],
  templateUrl: './experience-stop.component.html',
  styleUrl: './experience-stop.component.scss',
  host: {
    '[class.school]': "kind() === 'school'",
    '[class.first]': 'first()',
    '[class.last]': 'last()',
    '[class.card-left]': "cardSide() === 'left'",
  },
  hostDirectives: [GridItemDirective],
})
export class ExperienceStopComponent {
  /**
   * Step the stop stands for
   */
  public readonly context = input.required<ContextWithProjects>();

  /**
   * Side of the timeline the card of the step sits on from large screens up, the dates going on the
   * other one
   */
  public readonly cardSide = input<'left' | 'right'>('right');

  /**
   * Whether it is the first stop shown, where the rail starts
   */
  public readonly first = input(false);

  /**
   * Whether it is the last stop shown, where the rail ends
   */
  public readonly last = input(false);

  /**
   * Kind of the step, which gives the colour and the icon of the node
   */
  protected readonly kind = computed(() => experienceKind(this.context()));

  /**
   * Whether the step has not started yet
   */
  protected readonly upcoming = computed(
    () => new Date(this.context().start_date) > new Date()
  );
}
