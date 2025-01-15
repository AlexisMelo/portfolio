import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../project.model';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { LoadingService } from 'src/app/shared/loading/loading.service';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { DurationPipe } from '../duration.pipe';
import { SuggestionChipComponent } from '../../shared/chips/suggestion-chip/suggestion-chip.component';
import { SeparatorComponent } from 'src/app/shared/separator/separator.component';
import { RightArrowComponent } from '../../landing-page/timeline/right-arrow/right-arrow.component';
import { Skill } from '../skill.model';
import { StatusPipe } from '../status/status.pipe';
import { HighlightableChipComponent } from 'src/app/shared/chips/highlightable-chip/highlightable-chip.component';
import { SectionGroupComponent } from './section-group/section-group.component';

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
  public skillsGroupedByType?: { [key: string]: Array<Skill> };

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

        if (project.skill.length < 1) return;

        this.skillsGroupedByType = this.project.skill.reduce(
          (rv: { [key: string]: Array<Skill> }, x) => {
            (rv[x.skill_type.label] = rv[x.skill_type.label] || []).push(x);
            return rv;
          },
          {}
        );
      })
      .catch(err => console.log(err));
  }
}
