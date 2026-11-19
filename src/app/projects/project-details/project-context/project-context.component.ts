import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { PROJECTS_ROUTE } from 'src/app/route-paths';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LanguageService } from 'src/app/shared/language.service';
import { ActionButtonComponent } from '../../../home/action-button/action-button.component';
import { Project } from '../../project.model';

@Component({
  selector: 'app-project-context',
  imports: [ActionButtonComponent, RouterLink, TranslocoPipe],
  templateUrl: './project-context.component.html',
  styleUrl: './project-context.component.scss',
  host: { class: 'g-grid-item-start-aligned g-grid-item-highlight' },
})
export class ProjectContextComponent extends GridItemDirective {
  /**
   * Projet à afficher
   */
  public project = input.required<Project>();

  /**
   * Path of the projects page, which the link opens filtered on the context
   */
  protected readonly PROJECTS_ROUTE = PROJECTS_ROUTE;

  /** Handle language */
  private languageService = inject(LanguageService);

  /** Context label in the currently active language. */
  public label = computed(
    () =>
      this.project().project_context.localizedLabel?.[
        this.languageService.currentLang()
      ]
  );

  /** Context description in the currently active language. */
  public description = computed(
    () =>
      this.project().project_context.localizedDescription?.[
        this.languageService.currentLang()
      ]
  );
}
