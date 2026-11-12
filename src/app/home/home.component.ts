import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GridDragDirective } from '../shared/grid/grid-drag.directive';
import { GridEntranceDirective } from '../shared/grid/grid-entrance.directive';
import { SupabaseService } from '../shared/supabase.service';
import { CompaniesComponent } from './companies/companies.component';
import { ImageComponent } from './image/image.component';
import { JobComponent } from './job/job.component';
import { MailComponent } from './mail/mail.component';
import { MapComponent } from './map/map.component';
import { PlayHintComponent } from './play-hint/play-hint.component';
import { ProjectCard } from './projects-preview/project-card/project-card.model';
import { ProjectsPreviewComponent } from './projects-preview/projects-preview.component';
import { ResumeComponent } from './resume/resume.component';
import { SocialLinkComponent } from './social-link/social-link.component';

@Component({
  selector: 'app-home',
  imports: [
    MatIconModule,
    SocialLinkComponent,
    MailComponent,
    JobComponent,
    ResumeComponent,
    MapComponent,
    ImageComponent,
    ProjectsPreviewComponent,
    CompaniesComponent,
    PlayHintComponent,
    GridEntranceDirective,
    GridDragDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  /**
   * Projects pinned in the database, for the projects preview. Empty until they are loaded: the
   * preview shows a loader meanwhile
   */
  protected readonly pinnedProjects = signal<Array<ProjectCard>>([]);

  /**
   * Gestion de la base de donnée
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Loads the pinned projects
   */
  ngOnInit() {
    this.supabaseService
      .getPinnedProjects()
      .then(projects => this.pinnedProjects.set(projects));
  }
}
