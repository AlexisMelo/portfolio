import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { PROJECTS_ROUTE } from 'src/app/route-paths';
import { LanguageService } from 'src/app/shared/language.service';
import { ProjectCard } from './project-card.model';

/**
 * A project in the projects preview of the home page: number, illustration, name,
 * description, then its context and a round link to its details. The whole card leads to the
 * details.
 */
@Component({
  selector: 'app-project-card',
  imports: [MatIconModule, NgOptimizedImage, RouterLink, TranslocoPipe],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
  host: {
    '(click)': 'navigate($event)',
  },
})
export class ProjectCardComponent {
  /**
   * Project to display
   */
  public readonly project = input.required<ProjectCard>();

  /**
   * Path of the projects page, the base of the project details paths
   */
  protected readonly PROJECTS_ROUTE = PROJECTS_ROUTE;

  /**
   * Description in the active language
   */
  protected readonly description = computed(
    () =>
      this.project().localizedDescription?.[
        this.languageService.currentLang()
      ] ?? null
  );

  /**
   * Label of the context in the active language
   */
  protected readonly context = computed(
    () =>
      this.project().project_context?.localizedLabel?.[
        this.languageService.currentLang()
      ] ?? null
  );

  /**
   * Illustration with the lowest position, if the project has one
   */
  protected readonly illustration = computed(() =>
    this.project().illustrations.reduce<
      ProjectCard['illustrations'][number] | undefined
    >(
      (first, current) =>
        !first || current.position < first.position ? current : first,
      undefined
    )
  );

  /**
   * Single source of truth for the active language
   */
  private readonly languageService = inject(LanguageService);

  /**
   * Handles routing
   */
  private readonly router = inject(Router);

  /**
   * Opens the details of the project when the card is clicked outside of its link, which
   * navigates by itself
   */
  protected navigate(event: MouseEvent): void {
    if ((event.target as Element).closest('a')) return;
    this.router.navigate([PROJECTS_ROUTE, this.project().url]);
  }
}
