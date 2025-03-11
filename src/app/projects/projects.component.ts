import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GithubComponent } from '../contact/github/github.component';
import { ContentService } from '../shared/content.service';
import { SupabaseService } from '../shared/supabase.service';
import { ProjectItemComponent } from './project-item/project-item.component';
import { ProjectItem } from './project-item/project-item.model';
import { ShuffleComponent } from './shuffle/shuffle.component';
import { OngoingComponent } from './ongoing/ongoing.component';
import { AllComponent } from './all/all.component';

//animation : https://sergeygultyayev.medium.com/animations-in-angular-756e1d59e385
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    ProjectItemComponent,
    ReactiveFormsModule,
    FormsModule,
    GithubComponent,
    ShuffleComponent,
    OngoingComponent,
    AllComponent,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  /**
   * Liste des projets réalisés
   */
  private projects: Array<ProjectItem> = [];

  /**
   * Gestion de la base de donnée
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Gestion du contenu
   */
  public contentService = inject(ContentService);

  /**
   * Projets épinglés
   */
  get pinnedProjects() {
    return this.projects.filter(p => p.pinned);
  }

  /**
   * Projets en cours
   */
  get ongoingProjects() {
    return this.projects.filter(p => p.end_date === null && !p.abandoned);
  }

  /**
   * Implémentation de OnInit
   */
  ngOnInit() {
    this.supabaseService
      .getPinnedProjects()
      .then(projects => (this.projects = projects));
  }
}
