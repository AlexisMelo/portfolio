import { DatePipe, KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { HighlightableChipComponent } from 'src/app/shared/chips/highlightable-chip/highlightable-chip.component';
import { LoadingService } from 'src/app/shared/loading/loading.service';
import { SeparatorComponent } from 'src/app/shared/separator/separator.component';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { RightArrowComponent } from '../../landing-page/timeline/right-arrow/right-arrow.component';
import { SuggestionChipComponent } from '../../shared/chips/suggestion-chip/suggestion-chip.component';
import { DurationPipe } from '../duration.pipe';
import { Project } from '../project.model';
import { StatusPipe } from '../status/status.pipe';
import { ProjectContextComponent } from './project-context/project-context.component';
import { ProjectDescriptionComponent } from './project-description/project-description.component';
import { ProjectDurationComponent } from './project-duration/project-duration.component';
import { ProjectIllustrationsComponent } from './project-illustrations/project-illustrations.component';
import { SectionGroupComponent } from './section-group/section-group.component';
import { SkillWithType } from './skill-with-type.model';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    DatePipe,
    MatIcon,
    DurationPipe,
    SuggestionChipComponent,
    HighlightableChipComponent,
    SeparatorComponent,
    RightArrowComponent,
    KeyValuePipe,
    StatusPipe,
    SectionGroupComponent,
    ProjectDescriptionComponent,
    ProjectDurationComponent,
    ProjectContextComponent,
    ProjectIllustrationsComponent,
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent {
  /**
   * Route
   */
  private route = inject(ActivatedRoute);

  /**
   * Service pour accéder à la base de données
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Service pour gérer les chargements
   */
  private loadingService = inject(LoadingService);

  /**
   * URL unique identifiant le projet
   */
  public projectUniqueUrl?: string;

  /**
   * Projet à afficher
   */
  public project?: Project;

  /**
   * Skills liés au projet groupés par type
   */
  public skillsGroupedByType?: { [key: string]: Array<SkillWithType> };

  /**
   * Constructeur
   */
  constructor() {
    this.loadingService.projectDetails = this.projectUniqueUrl =
      this.route.snapshot.params['url'];
    if (!this.projectUniqueUrl) return;
    this.supabaseService
      .getProjectByUrl(this.projectUniqueUrl)
      .then(project => {
        if (project === null) return;
        this.project = project;

        if (project.skills.length < 1) return;

        this.skillsGroupedByType = this.project.skills.reduce(
          (rv: { [key: string]: Array<SkillWithType> }, x) => {
            (rv[x.skill_type.label] = rv[x.skill_type.label] || []).push(x);
            return rv;
          },
          {}
        );
      })
      .catch(err => console.log(err));
  }
}
