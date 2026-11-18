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
import { AllComponent } from '../projects/all/all.component';
import { firstStartYear } from '../shared/first-start-year';
import { GridDragDirective } from '../shared/grid/grid-drag.directive';
import { GridEntranceDirective } from '../shared/grid/grid-entrance.directive';
import { SupabaseService } from '../shared/supabase.service';
import { FavoritesComponent } from './favorites/favorites.component';
import { KeepLearningComponent } from './keep-learning/keep-learning.component';
import { SkillCategoriesComponent } from './skill-categories/skill-categories.component';
import { Skill } from './skill.model';
import { SkillsHeadingComponent } from './skills-heading/skills-heading.component';

/**
 * Skills page: how many technologies, the favourite ones, the ones being learnt, and every skill
 * by category
 */
@Component({
  selector: 'app-skills',
  imports: [
    KeepLearningComponent,
    FavoritesComponent,
    SkillsHeadingComponent,
    SkillCategoriesComponent,
    AllComponent,
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
