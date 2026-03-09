import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LanguageService } from 'src/app/shared/language.service';
import { ActionButtonComponent } from '../../../home/action-button/action-button.component';
import { Project } from '../../project.model';

@Component({
  selector: 'app-project-context',
  imports: [ActionButtonComponent, TranslocoPipe],
  templateUrl: './project-context.component.html',
  styleUrl: './project-context.component.scss',
  host: { class: 'g-grid-item-start-aligned g-grid-item-shadow' },
})
export class ProjectContextComponent extends GridItemDirective {
  /**
   * Projet à afficher
   */
  public project = input.required<Project>();

  /**
   * Gestion du routeur
   */
  private router = inject(Router);

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

  /**
   * Ouvre plus de projets du même contexte
   */
  public moreProjects() {
    this.router.navigate([ARCHIVES_ROUTE], {
      queryParams: {
        contexts: this.project().project_context.id,
      },
    });
  }
}
