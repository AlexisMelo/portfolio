import { Component, computed, inject, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResumeComponent } from '../home/resume/resume.component';
import { KeyHeaderComponent } from '../projects/key-header/key-header.component';
import { ContextWithProjects } from '../projects/context-with-projects.model';
import { GridDragDirective } from '../shared/grid/grid-drag.directive';
import { GridEntranceDirective } from '../shared/grid/grid-entrance.directive';
import { LanguageService } from '../shared/language.service';
import { SupabaseService } from '../shared/supabase.service';
import { ExperienceDescriptionComponent } from './experience-description/experience-description.component';
import { ExperienceDurationComponent } from './experience-duration/experience-duration.component';
import { ExperienceFilteringComponent } from './experience-filtering/experience-filtering.component';
import { ExperienceKind, experienceKind } from './experience-kind.model';
import { ExperienceHeadingComponent } from './experience-heading/experience-heading.component';
import { ExperienceProjectsComponent } from './experience-projects/experience-projects.component';
import { YourCompanyComponent } from './your-company/your-company.component';

@Component({
  selector: 'app-experience',
  imports: [
    ExperienceHeadingComponent,
    YourCompanyComponent,
    ResumeComponent,
    ExperienceFilteringComponent,
    KeyHeaderComponent,
    ExperienceDurationComponent,
    ExperienceProjectsComponent,
    ExperienceDescriptionComponent,
    GridEntranceDirective,
    GridDragDirective,
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
   * Handle language
   */
  public languageService = inject(LanguageService);

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
