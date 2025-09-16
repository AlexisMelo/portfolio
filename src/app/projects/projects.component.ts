import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GithubComponent } from '../home/github/github.component';
import { ContentService } from '../shared/content.service';
import { RangePipe } from '../shared/pipes/range.pipe';
import { SupabaseService } from '../shared/supabase.service';
import { AllComponent } from './all/all.component';
import { OngoingComponent } from './ongoing/ongoing.component';
import { ProjectItemComponent } from './project-item/project-item.component';
import { ProjectItem } from './project-item/project-item.model';
import { YourProjectComponent } from './your-project/your-project.component';
import { WithSkillComponent } from './with-skill/with-skill.component';
import { gridItemAnimation } from '../shared/animations';

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
    RangePipe,
    YourProjectComponent,
    WithSkillComponent,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  animations: [gridItemAnimation],
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
