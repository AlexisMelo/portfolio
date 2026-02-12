import { Component, computed, inject, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AvailabilityComponent } from '../home/availability/availability.component';
import { ResumeComponent } from '../home/resume/resume.component';
import { KeyHeaderComponent } from '../projects/archives/key-header/key-header.component';
import { ContextWithProjects } from '../projects/context-with-projects.model';
import { gridItemAnimation } from '../shared/animations';
import { GridItemDirective } from '../shared/grid/grid-item.directive';
import { SupabaseService } from '../shared/supabase.service';
import { ExperienceDescriptionComponent } from './experience-description/experience-description.component';
import { ExperienceDurationComponent } from './experience-duration/experience-duration.component';
import { ExperienceProjectsComponent } from './experience-projects/experience-projects.component';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [
    ResumeComponent,
    KeyHeaderComponent,
    ExperienceDurationComponent,
    ExperienceProjectsComponent,
    ExperienceDescriptionComponent,
    GridItemDirective,
    AvailabilityComponent,
  ],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
  animations: [gridItemAnimation],
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
}
