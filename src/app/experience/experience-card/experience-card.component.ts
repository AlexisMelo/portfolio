import { Dialog } from '@angular/cdk/dialog';
import { Component, computed, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';
import { ActionButtonComponent } from 'src/app/home/action-button/action-button.component';
import { ContextWithProjects } from 'src/app/projects/context-with-projects.model';
import { DurationPipe } from 'src/app/projects/duration.pipe';
import { PROJECTS_ROUTE } from 'src/app/route-paths';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LanguageService } from 'src/app/shared/language.service';
import { experienceKind } from '../experience-kind.model';
import {
  EXPERIENCE_DESCRIPTION_DIALOG_TITLE_ID,
  ExperienceDescriptionDialogComponent,
  ExperienceDescriptionDialogData,
} from './experience-description-dialog/experience-description-dialog.component';

/**
 * Card of a step of the path: a band in the colour of its kind (teal for the jobs, mustard for the
 * schools) with the name, the end year, the place and the duration; then the job, the description,
 * a button opening the whole description in a dialog and one opening the projects done there.
 */
@Component({
  selector: 'app-experience-card',
  imports: [
    ActionButtonComponent,
    DurationPipe,
    MatIcon,
    RouterLink,
    TranslocoDatePipe,
    TranslocoPipe,
  ],
  templateUrl: './experience-card.component.html',
  styleUrl: './experience-card.component.scss',
  host: {
    '[class.school]': "kind() === 'school'",
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
   * Handle language
   */
  private readonly languageService = inject(LanguageService);

  /**
   * Kind of the step, which gives the colour of the band
   */
  protected readonly kind = computed(() => experienceKind(this.context()));

  /**
   * Whether the step has not started yet, its start year then showing instead of the end one
   */
  protected readonly upcoming = computed(
    () => new Date(this.context().start_date) > new Date()
  );

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
   * Long description in the current language, or the short one for a step without a long one
   */
  protected readonly description = computed(() => {
    const lang = this.languageService.currentLang();
    return (
      this.context().localizedLongDescription?.[lang] ??
      this.context().localizedDescription?.[lang]
    );
  });

  /**
   * Number of projects done during the step
   */
  protected readonly projectsCount = computed(
    () => this.context().projects.length
  );

  /**
   * Opens dialogs above the page
   */
  private readonly dialog = inject(Dialog);

  /**
   * Opens a dialog with the whole description, which the card cuts after a few lines
   */
  protected openDescription() {
    const description = this.description();
    if (!description) return;

    this.dialog.open<void, ExperienceDescriptionDialogData>(
      ExperienceDescriptionDialogComponent,
      {
        ariaLabelledBy: EXPERIENCE_DESCRIPTION_DIALOG_TITLE_ID,
        data: { title: this.label(), description, kind: this.kind() },
      }
    );
  }
}
