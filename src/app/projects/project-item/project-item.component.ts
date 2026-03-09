import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { PROJECTS_ROUTE } from 'src/app/app.routes';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LanguageService } from 'src/app/shared/language.service';
import { LoaderComponent } from 'src/app/shared/loader/loader.component';
import { ProjectItemSkillListComponent } from './project-item-skill-list/project-item-skill-list.component';
import { ProjectItem } from './project-item.model';

@Component({
  selector: 'app-project-item',
  imports: [ProjectItemSkillListComponent, LoaderComponent],
  templateUrl: './project-item.component.html',
  styleUrl: './project-item.component.scss',
  host: {
    class: 'g-grid-item-start-aligned g-grid-item-shadow',
    '(click)': 'navigate()',
  },
})
export class ProjectItemComponent extends GridItemDirective {
  /**
   * Project to display
   */
  public project = input.required<ProjectItem>();

  private router = inject(Router);

  /** Language service */
  private languageService = inject(LanguageService);

  /** Description in the currently active language. */
  protected description = computed(
    () =>
      this.project()?.localizedDescription?.[this.languageService.currentLang()]
  );

  /**
   * Link to projects
   */
  public PROJECTS_ROUTE = PROJECTS_ROUTE;

  /** Skills to display, filtered to highlighted ones. */
  protected skills = computed(() =>
    this.project()
      .project_skills.filter(s => s.highlight)
      .map(s => s.skill)
  );

  /** First illustration to display, sorted by position. */
  protected firstIllustration = computed(() =>
    this.project().illustrations.reduce((prev, current) =>
      prev.position > current.position ? current : prev
    )
  );

  /** Navigate to the project detail page. */
  protected navigate() {
    this.router.navigate([PROJECTS_ROUTE, this.project().url]);
  }
}
