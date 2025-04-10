import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GithubComponent } from '../contact/github/github.component';
import { ContentService } from '../shared/content.service';
import { SupabaseService } from '../shared/supabase.service';
import { AllComponent } from './all/all.component';
import { OngoingComponent } from './ongoing/ongoing.component';
import { ProjectItemComponent } from './project-item/project-item.component';
import { ProjectItem } from './project-item/project-item.model';
import { ProjectsByContextComponent } from './projects-by-context/projects-by-context.component';
import { RangePipe } from '../shared/pipes/range.pipe';
import { ProjectItemPlaceholderComponent } from './project-item/project-item-placeholder/project-item-placeholder.component';

//animation : https://sergeygultyayev.medium.com/animations-in-angular-756e1d59e385
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    ProjectItemComponent,
    ReactiveFormsModule,
    FormsModule,
    GithubComponent,
    OngoingComponent,
    AllComponent,
    ProjectsByContextComponent,
    RangePipe,
    ProjectItemPlaceholderComponent,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  /**
   * Liste des projets réalisés
   */
  public pinnedProjects: Array<ProjectItem> = [];

  /**
   * Gestion de la base de donnée
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Gestion du contenu
   */
  public contentService = inject(ContentService);

  /**
   * Implémentation de OnInit
   */
  ngOnInit() {
    this.supabaseService
      .getPinnedProjects()
      .then(projects => (this.pinnedProjects = projects));
  }
}
