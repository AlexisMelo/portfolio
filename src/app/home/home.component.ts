import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProjectItemComponent } from '../projects/project-item/project-item.component';
import { ProjectItem } from '../projects/project-item/project-item.model';
import { ContentService } from '../shared/content.service';
import { GridEntranceDirective } from '../shared/grid/grid-entrance.directive';
import { GridItemDirective } from '../shared/grid/grid-item.directive';
import { RangePipe } from '../shared/pipes/range.pipe';
import { SupabaseService } from '../shared/supabase.service';
import { AvailabilityComponent } from './availability/availability.component';
import { DescriptionComponent } from './description/description.component';
import { GithubComponent } from './github/github.component';
import { ImageComponent } from './image/image.component';
import { LinkedinComponent } from './linkedin/linkedin.component';
import { MailComponent } from './mail/mail.component';
import { MapComponent } from './map/map.component';
import { NowComponent } from './now/now.component';
import { ResumeComponent } from './resume/resume.component';

@Component({
  selector: 'app-home',
  imports: [
    MatIconModule,
    LinkedinComponent,
    GithubComponent,
    MailComponent,
    DescriptionComponent,
    ResumeComponent,
    MapComponent,
    NowComponent,
    AvailabilityComponent,
    ImageComponent,
    ProjectItemComponent,
    RangePipe,
    GridItemDirective,
    GridEntranceDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  /**
   * Gestion du contenu
   */
  public contentService = inject(ContentService);

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
