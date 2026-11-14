import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';
import { PROJECTS_ROUTE } from 'src/app/route-paths';
import { LanguageService } from 'src/app/shared/language.service';
import { ListedProject } from '../listed-project.model';
import { PROJECT_TYPE_KEYS } from '../project-category.model';
import { getProjectStatus } from '../status/status.pipe';

/**
 * Project in the list of the projects page: its number, name, description, type and end year.
 * The whole row leads to the project details. A row on medium screens and up, a card on phones.
 */
@Component({
  selector: 'app-project-row',
  imports: [RouterLink, TranslocoPipe, TranslocoDatePipe],
  templateUrl: './project-row.component.html',
  styleUrl: './project-row.component.scss',
})
export class ProjectRowComponent {
  /**
   * Project to display
   */
  public readonly project = input.required<ListedProject>();

  /**
   * Number of the project, its rank among every project
   */
  public readonly number = input.required<number>();

  /**
   * Language of the description
   */
  private readonly languageService = inject(LanguageService);

  /**
   * Link to the project details
   */
  protected readonly link = computed(() => [
    PROJECTS_ROUTE,
    this.project().url,
  ]);

  /**
   * Description in the currently active language
   */
  protected readonly description = computed(
    () =>
      this.project().localizedDescription?.[this.languageService.currentLang()]
  );

  /**
   * Status of the project: completed, ongoing or abandoned
   */
  protected readonly status = computed(() => getProjectStatus(this.project()));

  /**
   * Translation key of the type, undefined for a type without one (its stored label is displayed)
   */
  protected readonly typeKey = computed(() => {
    const type = this.project().project_type;
    return type ? PROJECT_TYPE_KEYS[type.id] : undefined;
  });
}
