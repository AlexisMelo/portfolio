import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GithubComponent } from '../home/github/github.component';
import { ContentService } from '../shared/content.service';
import { GridEntranceDirective } from '../shared/grid/grid-entrance.directive';
import { RangePipe } from '../shared/pipes/range.pipe';
import { SupabaseService } from '../shared/supabase.service';
import { AllComponent } from './all/all.component';
import { OngoingComponent } from './ongoing/ongoing.component';
import { ProjectItemComponent } from './project-item/project-item.component';
import { ProjectItem } from './project-item/project-item.model';
import { WithSkillComponent } from './with-skill/with-skill.component';
import { YourProjectComponent } from './your-project/your-project.component';
import { GridItemDirective } from '../shared/grid/grid-item.directive';

@Component({
  selector: 'app-projects',
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
    GridItemDirective,
    GridEntranceDirective,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  /**
   * Liste des projets réalisés
   */
  protected readonly pinnedProjects = signal<Array<ProjectItem>>([]);

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
      .then(projects => this.pinnedProjects.set(projects));
  }
}
