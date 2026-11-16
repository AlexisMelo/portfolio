import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ContextWithProjects } from 'src/app/projects/context-with-projects.model';
import { DurationPipe } from 'src/app/projects/duration.pipe';
import { PROJECTS_ROUTE } from 'src/app/route-paths';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LanguageService } from 'src/app/shared/language.service';
import { experienceKind } from '../experience-kind.model';

/**
 * Card of a step of the experience timeline: a band in the colour of its kind (teal for the jobs,
 * mustard for the schools) with the name, the place and the duration, and a coral sticker linking to
 * the projects done there; then the job and the description. A notch points to the timeline.
 */
@Component({
  selector: 'app-experience-card',
  imports: [DurationPipe, RouterLink, TranslocoPipe],
  templateUrl: './experience-card.component.html',
  styleUrl: './experience-card.component.scss',
  host: {
    '[class.school]': "kind() === 'school'",
    '[class.left]': "side() === 'left'",
  },
  hostDirectives: [GridItemDirective],
})
export class ExperienceCardComponent {
  /**
   * Link to the projects list
   */
  protected readonly PROJECTS_ROUTE = PROJECTS_ROUTE;

  /**
   * Step to display
   */
  public readonly context = input.required<ContextWithProjects>();

  /**
   * Side of the timeline the card sits on from large screens up; on smaller ones it is always on the
   * right
   */
  public readonly side = input<'left' | 'right'>('right');

  /**
   * Handle language
   */
  private readonly languageService = inject(LanguageService);

  /**
   * Kind of the step, which gives the colour of the band
   */
  protected readonly kind = computed(() => experienceKind(this.context()));

  /**
   * Name of the step in the current language
   */
  protected readonly label = computed(
    () =>
      this.context().localizedLabel?.[this.languageService.currentLang()] ??
      this.context().label
  );

  /**
   * Job title in the current language
   */
  protected readonly job = computed(
    () => this.context().localizedJob?.[this.languageService.currentLang()]
  );

  /**
   * Description in the current language
   */
  protected readonly description = computed(
    () =>
      this.context().localizedDescription?.[this.languageService.currentLang()]
  );

  /**
   * Number of projects done during the step
   */
  protected readonly projectsCount = computed(
    () => this.context().projects.length
  );
}
