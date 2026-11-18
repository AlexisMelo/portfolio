import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Constants } from 'database.types';
import { PROJECTS_ROUTE } from 'src/app/route-paths';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { Skill } from '../skill.model';

/**
 * Categories of the tile, in display order, each matching a `skill_field` row
 */
const CATEGORIES = [
  { fieldId: 1, key: 'frontend' },
  { fieldId: 2, key: 'backend' },
  { fieldId: 3, key: 'transverse' },
] as const;

/**
 * Mastery levels from the best known to the least, in the order of the `skill_level` enum
 */
const LEVELS = Constants.public.Enums.skill_level;

/**
 * Grid rows the tile spans until its content is measured
 */
const DEFAULT_ROWS = 4;

/**
 * Category shown as one band of the tile
 */
interface SkillCategory {
  /**
   * Key of the category, which names its title in the translations
   */
  key: (typeof CATEGORIES)[number]['key'];

  /**
   * Skills of the category, the best known first, then the most used in projects
   */
  skills: Array<Skill>;
}

/**
 * Tile listing every skill in three bands, frontend, backend and transverse.
 */
@Component({
  selector: 'app-skill-categories',
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './skill-categories.component.html',
  styleUrl: './skill-categories.component.scss',
  hostDirectives: [GridItemDirective],
  host: { '[style.--skill-categories-rows]': 'rows()' },
})
export class SkillCategoriesComponent {
  /**
   * Every skill, undefined until they are loaded
   */
  public readonly skills = input.required<Array<Skill> | undefined>();

  /**
   * Bands of the tile, with their skills sorted by mastery, then by number of projects; skills of
   * the same mastery used in as many projects keep the alphabetical order of the database
   */
  protected readonly categories = computed<Array<SkillCategory>>(() => {
    const skills = this.skills() ?? [];
    return CATEGORIES.map(({ fieldId, key }) => ({
      key,
      skills: skills
        .filter(skill => skill.skill_field.id === fieldId)
        .sort(
          (a, b) =>
            LEVELS.indexOf(a.mastery) - LEVELS.indexOf(b.mastery) ||
            b.projects.length - a.projects.length
        ),
    }));
  });

  /**
   * Number of grid rows the tile spans, set from the measured height of its content
   */
  protected readonly rows = signal(DEFAULT_ROWS);

  /**
   * Page the chips lead to, filtered on their skill
   */
  protected readonly PROJECTS_ROUTE = PROJECTS_ROUTE;

  /**
   * The tile
   */
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;

  /**
   * Bands of the tile, which share the height left over by their content
   */
  private readonly bands = viewChildren<ElementRef<HTMLElement>>('band');

  /**
   * Content of each band, whose height does not depend on the tile's
   */
  private readonly bandContents =
    viewChildren<ElementRef<HTMLElement>>('bandContent');

  /**
   * Measures the content each time it changes size: when the chips arrive, when the fonts load and
   * when the tile changes width
   */
  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const observer = new ResizeObserver(() => this.measure());
      this.bandContents().forEach(content =>
        observer.observe(content.nativeElement)
      );
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  /**
   * Sets the number of grid rows the content needs, borders included
   */
  private measure() {
    const grid = this.host.parentElement;
    if (!grid) return;

    const gridStyle = getComputedStyle(grid);
    const cellSize = parseFloat(gridStyle.gridAutoRows);
    const gap = parseFloat(gridStyle.rowGap);

    // offsetHeight - clientHeight gives the borders: the tile and its bands never scroll
    let height = this.host.offsetHeight - this.host.clientHeight;
    this.bands().forEach(({ nativeElement: band }, i) => {
      height +=
        band.offsetHeight -
        band.clientHeight +
        this.bandContents()[i].nativeElement.getBoundingClientRect().height;
    });

    // a content that fits exactly must not take one more row because of rounding
    const rows = Math.ceil((height + gap) / (cellSize + gap) - 0.01);
    this.rows.set(Math.max(1, rows));
  }
}
