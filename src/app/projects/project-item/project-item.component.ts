import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { PROJECTS_ROUTE } from 'src/app/route-paths';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LanguageService } from 'src/app/shared/language.service';
import { ListedProject } from '../listed-project.model';
import { ProjectItemSkillListComponent } from './project-item-skill-list/project-item-skill-list.component';

/**
 * Tile of a project on the projects page: name, description, highlighted skills and illustration.
 * The whole tile leads to the project details.
 */
@Component({
  selector: 'app-project-item',
  imports: [ProjectItemSkillListComponent, NgOptimizedImage],
  templateUrl: './project-item.component.html',
  styleUrl: './project-item.component.scss',
  host: {
    class: 'g-grid-item-start-aligned',
    '(click)': 'navigate()',
  },
})
export class ProjectItemComponent extends GridItemDirective {
  /**
   * Project to display
   */
  public project = input.required<ListedProject>();

  /** Loads the illustration first, for the tile likely to be the LCP element. */
  public priority = input(false);

  /** Handle routing */
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

  protected firstIllustration = computed(() => {
    const illustrations = this.project().illustrations;
    if (illustrations.length === 0) return null;

    return illustrations.reduce((prev, current) =>
      prev.position > current.position ? current : prev
    );
  });

  /** Navigate to the project detail page. */
  protected navigate() {
    this.router.navigate([PROJECTS_ROUTE, this.project().url]);
  }
}
