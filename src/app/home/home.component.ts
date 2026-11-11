import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProjectItemComponent } from '../projects/project-item/project-item.component';
import { ProjectItem } from '../projects/project-item/project-item.model';
import { GridDragDirective } from '../shared/grid/grid-drag.directive';
import { GridEntranceDirective } from '../shared/grid/grid-entrance.directive';
import { RangePipe } from '../shared/pipes/range.pipe';
import { SupabaseService } from '../shared/supabase.service';
import { AvailabilityComponent } from './availability/availability.component';
import { DescriptionComponent } from './description/description.component';
import { ImageComponent } from './image/image.component';
import { MailComponent } from './mail/mail.component';
import { MapComponent } from './map/map.component';
import { NowComponent } from './now/now.component';
import { ResumeComponent } from './resume/resume.component';
import { SocialLinkComponent } from './social-link/social-link.component';

@Component({
  selector: 'app-home',
  imports: [
    MatIconModule,
    SocialLinkComponent,
    MailComponent,
    DescriptionComponent,
    ResumeComponent,
    MapComponent,
    NowComponent,
    AvailabilityComponent,
    ImageComponent,
    ProjectItemComponent,
    RangePipe,
    GridEntranceDirective,
    GridDragDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  /**
   * Projects pinned in the database, empty until they are loaded: the tiles show a loader meanwhile
   */
  protected readonly pinnedProjects = signal<Array<ProjectItem>>([]);

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
