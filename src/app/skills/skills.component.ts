import {
  afterRenderEffect,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { Enums } from 'database.types';
import { firstStartYear } from '../shared/first-start-year';
import { ContactTileComponent } from '../shared/contact-tile/contact-tile.component';
import { GridDragDirective } from '../shared/grid/grid-drag.directive';
import { GridEntranceDirective } from '../shared/grid/grid-entrance.directive';
import { SupabaseService } from '../shared/supabase.service';
import { ClickHintComponent } from './click-hint/click-hint.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { SkillCategoriesComponent } from './skill-categories/skill-categories.component';
import { SkillLevelFilteringComponent } from './skill-level-filtering/skill-level-filtering.component';
import { Skill } from './skill.model';
import { SkillsHeadingComponent } from './skills-heading/skills-heading.component';

/**
 * Skills page: how many technologies, the favourite ones, and every skill by category, filtered by
 * mastery level, with a hint that clicking a skill opens its projects
 */
@Component({
  selector: 'app-skills',
  imports: [
    FavoritesComponent,
    SkillsHeadingComponent,
    SkillCategoriesComponent,
    ClickHintComponent,
    SkillLevelFilteringComponent,
    ContactTileComponent,
    TranslocoPipe,
    GridEntranceDirective,
    GridDragDirective,
  ],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements OnInit {
  /**
   * Every skill, undefined until they are loaded
   */
  protected readonly skills = signal<Array<Skill> | undefined>(undefined);

  /**
   * Number of skills, 0 until they are loaded
   */
  protected readonly skillsCount = computed(() => this.skills()?.length ?? 0);

  /**
   * Mastery level of the skills shown, picked with the filter chips; null for all of them
   */
  protected readonly selectedLevel = signal<Enums<'skill_level'> | null>(null);

  /**
   * Skills of the selected level, undefined until they are loaded
   */
  protected readonly shownSkills = computed(() => {
    const level = this.selectedLevel();
    const skills = this.skills();
    return level === null
      ? skills
      : skills?.filter(skill => skill.mastery === level);
  });

  /**
   * Year the first project started, null until the projects are loaded
   */
  protected readonly firstYear = signal<number | null>(null);

  /**
   * Accès à la base de données
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Drag and drop of the tiles
   */
  private readonly gridDrag = viewChild.required(GridDragDirective);

  /**
   * Constructor
   */
  constructor() {
    // The skill categories grow when the skills arrive: tiles moved by the visitor before would keep
    // them at their loading size, so the page goes back to the CSS layout. Not when the visitor
    // resizes the categories, which would undo the resize.
    afterRenderEffect(() => {
      this.skills();
      untracked(() => this.gridDrag().reset());
    });
  }

  /**
   * Implémentation de OnInit
   */
  ngOnInit() {
    this.supabaseService
      .getProjects()
      .then(projects => this.firstYear.set(firstStartYear(projects)));

    this.supabaseService.getSkills().then(skills => this.skills.set(skills));
  }
}
