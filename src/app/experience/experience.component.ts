import { Component, computed, inject, signal } from '@angular/core';
import { ResumeComponent } from '../home/resume/resume.component';
import { ContextWithProjects } from '../projects/context-with-projects.model';
import { gridItemAnimation } from '../shared/animations';
import { SupabaseService } from '../shared/supabase.service';
import { KeyHeaderComponent } from '../projects/archives/key-header/key-header.component';
import { environment } from 'src/environments/environment';
import { ExperienceDurationComponent } from './experience-duration/experience-duration.component';
import { ExperienceProjectsComponent } from './experience-projects/experience-projects.component';
import { ExperienceDescriptionComponent } from './experience-description/experience-description.component';
import { LinkedinComponent } from '../home/linkedin/linkedin.component';
import { GridItemDirective } from '../shared/grid/grid-item.directive';
import { AvailabilityComponent } from '../home/availability/availability.component';
import { MailComponent } from '../home/mail/mail.component';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [
    ResumeComponent,
    KeyHeaderComponent,
    ExperienceDurationComponent,
    ExperienceProjectsComponent,
    ExperienceDescriptionComponent,
    LinkedinComponent,
    GridItemDirective,
    AvailabilityComponent,
    MailComponent,
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

  /**
   * Personal projects
   */
  public personalProjects = computed(() =>
    this.contexts().filter(c => c.id === environment.personalProjectsContextId)
  );
}
