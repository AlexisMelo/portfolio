import { Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { EXPERIENCE_ROUTE } from 'src/app/route-paths';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LanguageService } from 'src/app/shared/language.service';
import { SupabaseService } from 'src/app/shared/supabase.service';

/**
 * Seconds one name adds to the duration of a loop, so that the speed barely depends on the count
 */
const SECONDS_PER_NAME = 5;

/**
 * Companies I worked at, scrolling in a loop. Each name leads to the experience page.
 * The loop pauses while the mouse is over the tile, and stays still while the keyboard focus is on a
 * name and for visitors who reduce motion.
 */
@Component({
  selector: 'app-companies',
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss',
})
export class CompaniesComponent extends GridItemDirective {
  /**
   * Page every name leads to
   */
  protected readonly EXPERIENCE_ROUTE = EXPERIENCE_ROUTE;

  /**
   * Database service
   */
  private readonly supabaseService = inject(SupabaseService);

  /**
   * Single source of truth for the active language
   */
  private readonly languageService = inject(LanguageService);

  /**
   * Company names in the active language, fetched again on every language change
   */
  private readonly companies = resource({
    params: () => ({ lang: this.languageService.currentLang() }),
    loader: ({ params }) => this.supabaseService.getCompanyNames(params.lang),
  });

  /**
   * Company names, empty until they are loaded
   */
  protected readonly names = computed(() =>
    this.companies.hasValue() ? this.companies.value() : []
  );

  /**
   * Duration of one loop, longer with more names
   */
  protected readonly loopDuration = computed(
    () => `${Math.max(this.names().length, 1) * SECONDS_PER_NAME}s`
  );

  /**
   * Shows the whole name focused with the keyboard. The names have just stopped and gone back to
   * their place, which the browser did not wait for when it scrolled to the focused one.
   * @param event focus coming to one of the names
   */
  protected onFocusIn(event: FocusEvent) {
    const name = event.target as HTMLElement;
    if (name.matches(':focus-visible')) {
      name.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  /**
   * Brings the names back to their start when the focus leaves them, for the loop to start again
   * from there
   * @param event focus leaving one of the names
   */
  protected onFocusOut(event: FocusEvent) {
    const marquee = event.currentTarget as HTMLElement;
    if (!marquee.contains(event.relatedTarget as Node | null)) {
      marquee.scrollLeft = 0;
    }
  }
}
