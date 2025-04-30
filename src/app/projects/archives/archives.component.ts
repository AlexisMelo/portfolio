import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { ContextWithProjects } from 'src/app/landing-page/timeline/context-with-projects.model';
import { IsSelectedPipe } from 'src/app/shared/is-selected/is-selected.pipe';
import { SelectableItem } from 'src/app/shared/is-selected/selectable-item.model';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { Skill } from 'src/app/skills/skill.model';
import { SkillSectionDescriptionComponent } from '../../skills/skill-section-description/skill-section-description.component';
import { SkillSectionHeaderComponent } from '../../skills/skill-section-header/skill-section-header.component';
import { ProjectCondensedItemComponent } from '../project-item/project-item-condensed/project-item-condensed.component';
import { Project } from '../project.model';
import { SelectableStatus } from '../status/selectable-status.model';
import {
  getStatusKeyByValue,
  getStatusValueByKey,
  Status,
  statusesKeys,
} from '../status/status.model';
import { StatusPipe } from '../status/status.pipe';
import { ProjectCounterComponent } from './project-counter/project-counter.component';
import { ProjectFilteringComponent } from './project-filtering/project-filtering.component';
import { StatusFilteringComponent } from './status-filtering/status-filtering.component';

@Component({
  selector: 'app-archives',
  standalone: true,
  imports: [
    SkillSectionHeaderComponent,
    SkillSectionDescriptionComponent,
    ProjectCounterComponent,
    ProjectCondensedItemComponent,
    ProjectFilteringComponent,
    StatusFilteringComponent,
  ],
  templateUrl: './archives.component.html',
  styleUrl: './archives.component.scss',
  providers: [IsSelectedPipe, StatusPipe],
})
export class ArchivesComponent implements OnInit {
  /**
   * Gestion de la base de donnée
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Est-ce qu'un élément est sélectionné
   */
  private isSelectedPipe = inject(IsSelectedPipe);

  /**
   * Obtient le statut d'un projet
   */
  private statusPipe = inject(StatusPipe);

  /**
   * Gestion de la route actuelle
   */
  private route = inject(ActivatedRoute);

  /**
   * Gestion du routeur
   */
  private router = inject(Router);

  /**
   * List of all projects
   */
  public projects: Array<Project> = [];

  /**
   * List of all contexts
   */
  public contexts: Array<ContextWithProjects> = [];

  /**
   * List of all skills
   */
  public skills: Array<Skill> = [];

  /**
   * List of all statuses
   */
  public statuses: Array<SelectableStatus> = [];

  /**
   * List of selected contexts
   */
  private selectedContexts: Array<ContextWithProjects> = [];

  /**
   * List of selected skills
   */
  public selectedSkills: Array<Skill> = [];

  /**
   * Status sélectionnés
   */
  public selectedStatuses: Array<SelectableStatus> = [];

  /**
   * Text filter for projects
   */
  private filter: string | null = null;

  /**
   * List of selected projects
   */
  get selectedProjects() {
    return this.projects.filter(
      p =>
        this.isSelectedPipe.transform(
          this.selectedContexts,
          p.project_context
        ) &&
        ((p.project_skills.length === 0 &&
          this.selectedSkills.length === this.skills.length) ||
          this.selectedSkills.some(s =>
            this.isSelectedPipe.transform(
              p.project_skills.map(s => s.skill),
              s
            )
          )) &&
        this.selectedStatuses
          .map(s => s.label)
          .includes(getStatusValueByKey(this.statusPipe.transform(p))) &&
        (!this.filter || (this.filter && this.projectMatchesFilter(p)))
    );
  }

  /**
   * Implémentation de OnInit
   */
  ngOnInit() {
    this.supabaseService
      .getProjects()
      .then(projects => (this.projects = projects));

    const allStatuses: Array<SelectableStatus> = statusesKeys.map(key => ({
      id: key,
      label: getStatusValueByKey(key),
    }));

    this.statuses = allStatuses;
    this.selectedStatuses = allStatuses;

    this.route.queryParamMap.pipe(first()).subscribe(params => {
      const statuses = params.get('status');
      if (!statuses) return;
      const preselectedStatuses = statuses.split(',').map(s => s as Status);
      this.updateSelectedStatuses(
        this.statuses.filter(s =>
          preselectedStatuses.includes(getStatusKeyByValue(s.label))
        )
      );
    });

    this.supabaseService.getContexts().then(contexts => {
      this.contexts = contexts;
      this.selectedContexts = [...this.contexts];
      this.route.queryParamMap.pipe(first()).subscribe(params => {
        const contexts = params.get('contexts');
        if (!contexts) return;
        // const preselectedContexts = contexts.split(',').map(c => Number(c));
        // this.updateSelectedContexts(
        //   this.contexts.filter(c => preselectedContexts.includes(c.id))
        // );
      });
    });

    this.supabaseService.getSkills().then(skills => {
      this.skills = skills;
      this.selectedSkills = [...this.skills];
      this.route.queryParamMap.pipe(first()).subscribe(params => {
        const skills = params.get('skills');
        if (!skills) return;
        // const preselectedSkills = skills.split(',').map(s => Number(s));
        // this.updateSelectedSkills(
        //   this.skills.filter(s => preselectedSkills.includes(s.id))
        // );
      });
    });
  }

  /**
   * Met à jour la liste des statut sélectionnés
   * @param status
   */
  private updateSelectedStatuses(status: Array<SelectableStatus>) {
    this.selectedStatuses = status;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        status:
          this.selectedStatuses.length === this.statuses.length ||
          this.selectedStatuses.length === 0
            ? undefined
            : this.selectedStatuses
                .map(s => getStatusKeyByValue(s.label))
                .join(','),
      },
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Sélectionne tous les statuts
   */
  selectAllStatus() {
    this.updateSelectedStatuses([...this.statuses]);
  }

  /**
   * Est-ce que le projet match le filtre textuel
   * @param project
   */
  private projectMatchesFilter(project: Project): boolean {
    const filter = this.filter?.toLowerCase();
    if (!filter) return true; //si y'a pas de filtre

    if (project.label.toLowerCase().includes(filter)) return true; //nom
    if (project.project_type.label.toLowerCase().includes(filter)) return true;
    if (project.project_context.label.toLowerCase().includes(filter))
      return true;
    if (project.description?.toLowerCase().includes(filter)) return true;
    if (
      project.project_skills
        .map(s => s.skill.label.toLowerCase())
        .find(s => s.includes(filter)) !== undefined
    )
      return true;

    return false;
  }

  /**
   * Sélectionne un statut en particulier
   * @param option
   */
  public selectStatus(option: SelectableItem) {
    if (option.id === -1) {
      this.selectAllStatus();
      return;
    }
    this.updateSelectedStatuses([option as SelectableStatus]);
  }
}
