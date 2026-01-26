import {
  computed,
  inject,
  Injectable,
  Signal,
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
import { ActivatedRoute, Router } from '@angular/router';

export type OrderByType = 'year';
export type OrderDirection = 'asc' | 'desc';
type GroupedProjects = Array<{ key: string; projects: Array<Project> }>;

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
  public projects = signal<Array<Project>>([]);

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
   * Direction for ordering projects
   */
  public orderDirection = signal<OrderDirection>('desc');

  /**
   * Key to order projects
   */
  public orderBy = signal<OrderByType>('year');

  /**
   * Handle routing
   */
  private router = inject(Router);

  /**
   * Get current route information
   */
  private route = inject(ActivatedRoute);

  /**
   * Selected projects based on all the criterias
   */
  readonly selectedProjects: Signal<Array<Project>> = computed(() => {
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
   * Selected projects grouped and sorted
   */
  readonly sortedGroupedProjects: Signal<GroupedProjects> = computed(() => {
    const selectedProjects = this.selectedProjects();

    const reduced = selectedProjects.reduce(
      (group: { [key: string]: [Project] }, next: Project) => {
        const date = next.end_date ? new Date(next.end_date) : new Date();

        const endYear = date.getFullYear().toString();

        if (endYear in group) {
          group[endYear].push(next);
        } else {
          group[endYear] = [next];
        }

        return group;
      },
      {}
    );

    return Object.entries(reduced)
      .map(([key, projects]) => ({
        key,
        projects,
      }))
      .sort((firstGroup, secondGroup) => {
        if (firstGroup.key > secondGroup.key)
          return this.orderDirection() === 'asc' ? -1 : 1;
        if (firstGroup.key < secondGroup.key)
          return this.orderDirection() === 'asc' ? 1 : -1;
        return 0;
      });
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

  /**
   * Clear the selected skills, contexts, and keywords
   */
  public clearFiltering() {
    this.filter.set(null);
    this.selectedSkills.set(null);
    this.selectedContexts.set(null);
    this.selectedStatus.set(null);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        skills: null,
        contexts: null,
        status: null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
