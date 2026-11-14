import { computed, DOCUMENT, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { ListedProject, NumberedProject } from './listed-project.model';
import {
  ALL_CATEGORIES_CHIP_ID,
  isProjectCategory,
  PROJECT_TYPE_KEYS,
  ProjectCategory,
  projectIsInCategory,
} from './project-category.model';
import { isStatus, Status } from './status/status.model';
import { getProjectStatus } from './status/status.pipe';

/**
 * Projects of the projects page, its filters and the projects they select. Every filter but the
 * text one lives in the URL (`category`, `status`, `skills`, `contexts`): links from other pages and
 * the browser's back and forward buttons set them, and the chips write them there.
 */
@Injectable()
export class ProjectsService {
  /**
   * Database
   */
  private readonly supabaseService = inject(SupabaseService);

  /**
   * Translations, for the text filter on the project types
   */
  private readonly translocoService = inject(TranslocoService);

  /**
   * Writes the filters in the URL
   */
  private readonly router = inject(Router);

  /**
   * Route of the page, whose query params hold the filters
   */
  private readonly route = inject(ActivatedRoute);

  /**
   * Document, to move the focus
   */
  private readonly document = inject(DOCUMENT);

  /**
   * Every project
   */
  public readonly projects = signal<Array<ListedProject>>([]);

  /**
   * Whether the projects have arrived from the database
   */
  public readonly loaded = signal(false);

  /**
   * Query params of the page
   */
  private readonly queryParams = toSignal(this.route.queryParamMap, {
    requireSync: true,
  });

  /**
   * Ids of the selected contexts (links from the experience page and the project details), empty
   * for every context
   */
  public readonly selectedContextIds = computed(() =>
    getIds(this.queryParams(), 'contexts')
  );

  /**
   * Ids of the selected skills (links from the skills page and the project details), empty for
   * every skill
   */
  public readonly selectedSkillIds = computed(() =>
    getIds(this.queryParams(), 'skills')
  );

  /**
   * Selected status, null for every status
   */
  public readonly selectedStatus = computed(() => {
    const status = this.queryParams().get('status');
    return isStatus(status) ? status : null;
  });

  /**
   * Selected category (chips above the list), null for every project
   */
  public readonly selectedCategory = computed(() => {
    const category = this.queryParams().get('category');
    return isProjectCategory(category) ? category : null;
  });

  /**
   * Text typed in the search tile
   */
  public readonly filter = signal<string | null>(null);

  /**
   * Number of every project by id: its rank by end date, the oldest being n°1 and the ongoing ones
   * last. It does not depend on the filters, so a project keeps its number in every list.
   */
  private readonly numbers = computed(() => {
    const chronological = [...this.projects()].sort(compareChronologically);
    return new Map(
      chronological.map((project, index) => [project.id, index + 1])
    );
  });

  /**
   * Projects matching every filter
   */
  public readonly selectedProjects = computed(() => {
    const contextIds = this.selectedContextIds();
    const skillIds = this.selectedSkillIds();
    const status = this.selectedStatus();
    const category = this.selectedCategory();
    const filter = this.filter()?.toLowerCase();

    return this.projects().filter(
      project =>
        (contextIds.length === 0 ||
          contextIds.includes(project.project_context.id)) &&
        (skillIds.length === 0 ||
          project.project_skills.some(s => skillIds.includes(s.skill.id))) &&
        (status === null || status === getProjectStatus(project)) &&
        (category === null || projectIsInCategory(project, category)) &&
        (!filter || this.projectMatchesFilter(project, filter))
    );
  });

  /**
   * Selected projects with their number, the most recent first
   */
  public readonly listedProjects = computed<Array<NumberedProject>>(() => {
    const numbers = this.numbers();

    return this.selectedProjects()
      .map(project => ({ project, number: numbers.get(project.id) ?? 0 }))
      .sort((first, second) => second.number - first.number);
  });

  /**
   * Constructor
   */
  constructor() {
    this.supabaseService.getProjects().then(projects => {
      this.projects.set(projects);
      this.loaded.set(true);
    });
  }

  /**
   * Selects a category, null for every project
   * @param category category to select
   */
  public selectCategory(category: ProjectCategory | null) {
    this.writeQueryParams({ category });
  }

  /**
   * Selects a status, null for every status
   * @param status status to select
   */
  public selectStatus(status: Status | null) {
    this.writeQueryParams({ status });
  }

  /**
   * Clears every filter. The buttons doing it disappear with the filters, so the focus moves to the
   * "all" category chip.
   */
  public clearFiltering() {
    this.filter.set(null);
    this.writeQueryParams({
      category: null,
      status: null,
      skills: null,
      contexts: null,
    });
    this.document.getElementById(ALL_CATEGORIES_CHIP_ID)?.focus();
  }

  /**
   * Writes filters in the URL, keeping the others
   * @param queryParams filters to write, null removing one
   */
  private writeQueryParams(queryParams: Params) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Whether the name, description (in both languages), type (as displayed and as stored), context
   * or skills of a project contain the typed text
   * @param project project to check
   * @param filter typed text, in lower case
   */
  private projectMatchesFilter(
    project: ListedProject,
    filter: string
  ): boolean {
    const typeKey = project.project_type
      ? PROJECT_TYPE_KEYS[project.project_type.id]
      : undefined;

    const searched = [
      project.label,
      project.localizedDescription?.en,
      project.localizedDescription?.fr,
      project.project_type?.label,
      typeKey
        ? this.translocoService.translate(`projects.types.${typeKey}`)
        : undefined,
      project.project_context.label,
      ...project.project_skills.map(s => s.skill.label),
    ];

    return searched.some(text => text?.toLowerCase().includes(filter));
  }
}

/**
 * Ids of a query param, given as `1,2` or repeated
 * @param params query params of the page
 * @param key name of the query param
 */
function getIds(params: ParamMap, key: string): Array<number> {
  return params
    .getAll(key)
    .flatMap(value => value.split(','))
    .filter(value => value !== '')
    .map(Number)
    .filter(id => Number.isInteger(id));
}

/**
 * Orders two projects by end date, the ongoing ones (no end date) last, then by start date and id
 * @param first first project
 * @param second second project
 */
function compareChronologically(
  first: ListedProject,
  second: ListedProject
): number {
  return (
    compareDates(first.end_date, second.end_date) ||
    compareDates(first.start_date, second.start_date) ||
    first.id - second.id
  );
}

/**
 * Orders two ISO dates, a missing one last
 * @param first first date
 * @param second second date
 */
function compareDates(first: string | null, second: string | null): number {
  if (first === second) return 0;
  if (first === null) return 1;
  if (second === null) return -1;
  return first < second ? -1 : 1;
}
