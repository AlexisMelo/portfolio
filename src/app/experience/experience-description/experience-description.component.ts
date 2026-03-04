import { Component, computed, inject, input } from '@angular/core';
import { ContextWithProjects } from 'src/app/projects/context-with-projects.model';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LanguageService } from 'src/app/shared/language.service';

@Component({
  selector: 'app-experience-description',
  imports: [],
  templateUrl: './experience-description.component.html',
  styleUrl: './experience-description.component.scss',
  hostDirectives: [GridItemDirective],
})
export class ExperienceDescriptionComponent {
  /**
   * Context to display
   */
  public context = input.required<ContextWithProjects>();

  /**
   * Language service
   */
  private languageService = inject(LanguageService);

  /** Description in the currently active language. */
  public description = computed(
    () =>
      this.context().localizedDescription?.[this.languageService.currentLang()]
  );

  /** Job title in the currently active language. */
  public job = computed(
    () => this.context().localizedJob?.[this.languageService.currentLang()]
  );
}
