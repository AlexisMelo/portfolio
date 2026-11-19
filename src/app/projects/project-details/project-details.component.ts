import {
  afterRenderEffect,
  Component,
  computed,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { SocialLinkComponent } from 'src/app/home/social-link/social-link.component';
import { GridDragDirective } from 'src/app/shared/grid/grid-drag.directive';
import { GridEntranceDirective } from 'src/app/shared/grid/grid-entrance.directive';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { SkillCategoriesComponent } from 'src/app/skills/skill-categories/skill-categories.component';
import { OpenLiveComponent } from './open-live/open-live.component';
import { ProjectContextComponent } from './project-context/project-context.component';
import { ProjectCoworkersComponent } from './project-coworkers/project-coworkers.component';
import { ProjectDescriptionComponent } from './project-description/project-description.component';
import { ProjectTitleComponent } from './project-title/project-title.component';
import { ProjectDurationComponent } from './project-duration/project-duration.component';
import { ProjectIllustrationsComponent } from './project-illustrations/project-illustrations.component';
import { ProjectParticipationComponent } from './project-participation/project-participation.component';
import { ProjectProblematicComponent } from './project-problematic/project-problematic.component';

/**
 * Page of one project
 */
@Component({
  selector: 'app-project-details',
  imports: [
    ProjectDescriptionComponent,
    ProjectDurationComponent,
    ProjectContextComponent,
    ProjectIllustrationsComponent,
    ProjectProblematicComponent,
    SocialLinkComponent,
    ProjectCoworkersComponent,
    ProjectParticipationComponent,
    ProjectTitleComponent,
    OpenLiveComponent,
    SkillCategoriesComponent,
    GridEntranceDirective,
    GridDragDirective,
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
   * URL unique identifiant le projet
   */
  public projectUniqueUrl = signal<string | undefined>(undefined);

  /**
   * Drag and drop of the tiles, rendered with the project
   */
  private readonly gridDrag = viewChild(GridDragDirective);

  /**
   * Skills tile, absent when the project has no skills
   */
  private readonly skillCategories = viewChild(SkillCategoriesComponent);

  /**
   * Grid rows the skills tile spans, 0 without it. Set on the grid, so that the tiles placed under
   * the skills follow their measured height.
   */
  protected readonly skillRows = computed(
    () => this.skillCategories()?.rows() ?? 0
  );

  /**
   * Constructeur
   */
  constructor() {
    const url = this.route.snapshot.paramMap.get('url');
    if (url) this.projectUniqueUrl.set(url);

    // The skills tile takes the height of the project's skills once measured: tiles moved by the
    // visitor before would keep it at its loading size, so the page goes back to the CSS layout
    afterRenderEffect(() => {
      this.skills();
      untracked(() => this.gridDrag()?.reset());
    });
  }

  /**
   * Project to display based on url
   */
  protected project = toSignal(
    toObservable(this.projectUniqueUrl).pipe(
      filter(url => url !== undefined),
      switchMap(url => this.supabaseService.getProjectByUrl(url))
    )
  );

  /**
   * Skills used in the project
   */
  protected skills = computed(() => {
    return this.project()?.project_skills.map(s => s.skill) ?? [];
  });
}
