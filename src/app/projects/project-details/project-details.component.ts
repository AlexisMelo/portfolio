import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { GithubComponent } from 'src/app/home/github/github.component';
import { gridItemAnimation } from 'src/app/shared/animations';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { SkillsRecapComponent } from 'src/app/skills/skills-recap/skills-recap.component';
import { StatusPipe } from '../status/status.pipe';
import { OpenLiveComponent } from './open-live/open-live.component';
import { ProjectContextComponent } from './project-context/project-context.component';
import { ProjectCoworkersComponent } from './project-coworkers/project-coworkers.component';
import { ProjectDescriptionComponent } from './project-description/project-description.component';
import { ProjectDetailsIconComponent } from './project-details-icon/project-details-icon.component';
import { ProjectDurationComponent } from './project-duration/project-duration.component';
import { ProjectIllustrationsComponent } from './project-illustrations/project-illustrations.component';
import { ProjectParticipationComponent } from './project-participation/project-participation.component';
import { ProjectProblematicComponent } from './project-problematic/project-problematic.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    ProjectDescriptionComponent,
    ProjectDurationComponent,
    ProjectContextComponent,
    ProjectIllustrationsComponent,
    ProjectProblematicComponent,
    GithubComponent,
    ProjectCoworkersComponent,
    ProjectParticipationComponent,
    ProjectDetailsIconComponent,
    OpenLiveComponent,
    SkillsRecapComponent,
    StatusPipe,
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
  animations: [gridItemAnimation],
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
   * Constructeur
   */
  constructor() {
    const url = this.route.snapshot.paramMap.get('url');
    if (!url) return; //url empty ?
    this.projectUniqueUrl.set(url);
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
