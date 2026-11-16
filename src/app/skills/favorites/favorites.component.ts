import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { PROJECTS_ROUTE } from 'src/app/route-paths';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { LovedPipe } from '../loved.pipe';
import { Skill } from '../skill.model';

/**
 * Favourite skill shown as a sticker, with the class of its brand colours
 */
interface FavoriteSticker {
  /**
   * The loved skill
   */
  skill: Skill;

  /**
   * `sticker-` and the skill's label in lower case letters and digits only (`.NET Core` gives
   * `sticker-netcore`); a skill without brand colours in the theme files is a white sticker
   */
  brandClass: string;
}

/**
 * Mustard hero of the skills page: a big "my go-to stack" title and the loved skills as floating
 * brand-coloured stickers, each a link to the projects using it
 */
@Component({
  selector: 'app-favorites',
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
  providers: [LovedPipe],
  host: { class: 'g-grid-item-highlight' },
  hostDirectives: [GridItemDirective],
})
export class FavoritesComponent {
  /**
   * Handle database data
   */
  private readonly supabaseService = inject(SupabaseService);

  /**
   * Filter skills based on loved ones
   */
  private readonly lovedPipe = inject(LovedPipe);

  /**
   * Loved skills, empty until Supabase answers
   */
  private readonly skills = signal<Array<Skill>>([]);

  /**
   * Stickers to display, one per loved skill, the oldest in the database first so Angular and .NET
   * Core lead, as on the home page
   */
  protected readonly stickers = computed<Array<FavoriteSticker>>(() =>
    [...this.skills()]
      .sort((a, b) => a.id - b.id)
      .map(skill => ({
        skill,
        brandClass:
          'sticker-' + skill.label.toLowerCase().replace(/[^a-z0-9]/g, ''),
      }))
  );

  /**
   * Page the stickers lead to, filtered on their skill
   */
  protected readonly PROJECTS_ROUTE = PROJECTS_ROUTE;

  /**
   * Loads the loved skills
   */
  constructor() {
    this.supabaseService
      .getSkills()
      .then(skills => this.skills.set(this.lovedPipe.transform(skills)));
  }
}
