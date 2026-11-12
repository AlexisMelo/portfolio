import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';
import { EXPERIENCE_ROUTE } from 'src/app/route-paths';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LanguageService } from 'src/app/shared/language.service';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { Company } from './company.model';

/**
 * Seconds one name adds to the duration of a loop, so that the speed barely depends on the count
 */
const SECONDS_PER_NAME = 5;

/**
 * Companies I worked at, each with the end date of its context, scrolling in a loop. Each name
 * leads to the experience page.
 * The loop pauses while the mouse is over the tile, and stays still while the keyboard focus is on a
 * name and for visitors who reduce motion.
 */
@Component({
  selector: 'app-companies',
  imports: [NgTemplateOutlet, RouterLink, TranslocoPipe, TranslocoDatePipe],
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
   * Companies with their names in the active language, fetched again on every language change
   */
  private readonly companiesResource = resource({
    params: () => ({ lang: this.languageService.currentLang() }),
    loader: ({ params }) => this.supabaseService.getCompanies(params.lang),
  });

  /**
   * Companies, empty until they are loaded
   */
  protected readonly companies = computed<Company[]>(() =>
    this.companiesResource.hasValue() ? this.companiesResource.value() : []
  );

  /**
   * Duration of one loop, longer with more names
   */
  protected readonly loopDuration = computed(
    () => `${Math.max(this.companies().length, 1) * SECONDS_PER_NAME}s`
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
