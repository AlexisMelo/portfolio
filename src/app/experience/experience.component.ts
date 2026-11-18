import { Component, computed, inject, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { environment } from 'src/environments/environment';
import { ResumeComponent } from '../home/resume/resume.component';
import { ContextWithProjects } from '../projects/context-with-projects.model';
import { ContactTileComponent } from '../shared/contact-tile/contact-tile.component';
import { GridDragDirective } from '../shared/grid/grid-drag.directive';
import { GridEntranceDirective } from '../shared/grid/grid-entrance.directive';
import { SupabaseService } from '../shared/supabase.service';
import { ExperienceCardComponent } from './experience-card/experience-card.component';
import { ExperienceFilteringComponent } from './experience-filtering/experience-filtering.component';
import { ExperienceKind, experienceKind } from './experience-kind.model';
import { ExperienceHeadingComponent } from './experience-heading/experience-heading.component';

/**
 * Experience page
 */
@Component({
  selector: 'app-experience',
  imports: [
    ExperienceHeadingComponent,
    ContactTileComponent,
    ResumeComponent,
    ExperienceFilteringComponent,
    ExperienceCardComponent,
    GridEntranceDirective,
    GridDragDirective,
    TranslocoPipe,
  ],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent {
  /**
   * Handle database
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Contexts to display
   */
  private contexts = signal<Array<ContextWithProjects>>([]);

  /**
   * Constructor
   */
  constructor() {
    this.supabaseService
      .getContexts()
      .then(contexts => this.contexts.set(contexts.filter(c => c.id !== 9))); //removing "personal projects"
  }

  /**
   * Contexts to display
   */
  public baseContexts = computed(() =>
    this.contexts().filter(c => c.id !== environment.personalProjectsContextId)
  );

  /**
   * Kind of the steps shown, picked with the filter chips; null for all of them
   */
  protected readonly selectedKind = signal<ExperienceKind | null>(null);

  /**
   * Steps of the selected kind
   */
  protected readonly shownContexts = computed(() => {
    const kind = this.selectedKind();
    return kind === null
      ? this.baseContexts()
      : this.baseContexts().filter(context => experienceKind(context) === kind);
  });

  /**
   * Key of the shown steps, which replays the entrance of their tiles when the filter changes
   */
  protected readonly shownKey = computed(() =>
    this.shownContexts()
      .map(context => context.id)
      .join(',')
  );
}
