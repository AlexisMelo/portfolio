import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubComponent } from 'src/app/contact/github/github.component';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { SkillsRecapComponent } from 'src/app/skills/skills-recap/skills-recap.component';
import { Project } from '../project.model';
import { Skill } from '../../skills/skill.model';
import { ProjectContextComponent } from './project-context/project-context.component';
import { ProjectCoworkersComponent } from './project-coworkers/project-coworkers.component';
import { ProjectDescriptionComponent } from './project-description/project-description.component';
import { ProjectDetailsIconComponent } from './project-details-icon/project-details-icon.component';
import { ProjectDurationComponent } from './project-duration/project-duration.component';
import { ProjectIllustrationsComponent } from './project-illustrations/project-illustrations.component';
import { ProjectNameHeaderComponent } from './project-name-header/project-name-header.component';
import { ProjectParticipationComponent } from './project-participation/project-participation.component';
import { ProjectProblematicComponent } from './project-problematic/project-problematic.component';
import { StatusPipe } from '../status/status.pipe';
import { KebabCasePipe } from 'src/app/shared/pipes/kebab-case.pipe';

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
    ProjectNameHeaderComponent,
    SkillsRecapComponent,
    StatusPipe,
    KebabCasePipe,
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
    this.projectUniqueUrl = this.route.snapshot.params['url'];
    if (!this.projectUniqueUrl) return;
    this.supabaseService
      .getProjectByUrl(this.projectUniqueUrl)
      .then(project => {
        if (project === null) return;
        this.project = project;

        if (project.skills.length < 1) return;

        this.skillsGroupedByType = this.project.skills.reduce(
          (rv: { [key: string]: Array<Skill> }, x) => {
            (rv[x.skill_type.label] = rv[x.skill_type.label] || []).push(x);
            return rv;
          },
          {}
        );
      });
  }
}
