import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { ContextWithProjects } from 'src/app/projects/context-with-projects.model';
import { IsSelectedPipe } from 'src/app/shared/is-selected/is-selected.pipe';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { Skill } from 'src/app/skills/skill.model';
import { Project } from '../project.model';
import { Status } from '../status/status.model';
import { StatusPipe } from '../status/status.pipe';

/**
 * Handle the selected projects showed in archives
 */
@Injectable()
export class ArchivesService {
  /**
   * Est-ce qu'un élément est sélectionné
   */
  private isSelectedPipe = inject(IsSelectedPipe);

  /**
   * Obtient le statut d'un projet
   */
  private statusPipe = inject(StatusPipe);

  /**
   * Gestion de la base de donnée
   */
  private supabaseService = inject(SupabaseService);

  /**
   * List of all projects
   */
  public projects: WritableSignal<Array<Project>> = signal([]);

  /**
   * List of selected contexts
   */
  public selectedContexts: WritableSignal<Array<ContextWithProjects> | null> =
    signal(null);

  /**
   * List of selected skills
   */
  public selectedSkills: WritableSignal<Array<Skill> | null> = signal(null);

  /**
   * Selected status
   */
  public selectedStatus: WritableSignal<Status | null> = signal(null);

  /**
   * Text filter for projects
   */
  public filter: WritableSignal<string | null> = signal(null);

  /**
   * Update the selected projects when the selected contexts, skills, status or filter change
   */
  readonly selectedProjects = computed(() => {
    const selectedContexts = this.selectedContexts();
    const selectedSkills = this.selectedSkills();
    const selectedStatus = this.selectedStatus();
    const filter = this.filter();

    return this.projects().filter(
      p =>
        (selectedContexts === null ||
          this.isSelectedPipe.transform(selectedContexts, p.project_context)) &&
        (selectedSkills === null ||
          selectedSkills.some(s =>
            this.isSelectedPipe.transform(
              p.project_skills.map(s => s.skill),
              s
            )
          )) &&
        (selectedStatus === null ||
          selectedStatus === this.statusPipe.transform(p)) &&
        (filter === null ||
          filter === '' ||
          this.projectMatchesFilter(p, filter))
    );
  });

  /**
   * Constructor
   */
  constructor() {
    this.supabaseService
      .getProjects()
      .then(projects => this.projects.set(projects));
  }

  /**
   * Est-ce que le projet match le filtre textuel
   * @param project
   */
  private projectMatchesFilter(project: Project, filter: string): boolean {
    const treatedFilter = filter.toLowerCase();

    if (project.label.toLowerCase().includes(treatedFilter)) return true; //nom
    if (project.project_type.label.toLowerCase().includes(treatedFilter))
      return true;
    if (project.project_context.label.toLowerCase().includes(treatedFilter))
      return true;
    if (project.description?.toLowerCase().includes(treatedFilter)) return true;
    if (
      project.project_skills
        .map(s => s.skill.label.toLowerCase())
        .find(s => s.includes(treatedFilter)) !== undefined
    )
      return true;

    return false;
  }
}
