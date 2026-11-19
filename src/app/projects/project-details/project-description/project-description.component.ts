import { Component, computed, inject, input } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LanguageService } from 'src/app/shared/language.service';
import { Project } from '../../project.model';

/**
 * Tile of the project's short description
 */
@Component({
  selector: 'app-project-description',
  templateUrl: './project-description.component.html',
  styleUrl: './project-description.component.scss',
})
export class ProjectDescriptionComponent extends GridItemDirective {
  /**
   * Project
   */
  public readonly project = input.required<Project>();

  /** Language service */
  private languageService = inject(LanguageService);

  /** Description in the currently active language. */
  protected description = computed(
    () =>
      this.project().localizedDescription?.[this.languageService.currentLang()]
  );
}
