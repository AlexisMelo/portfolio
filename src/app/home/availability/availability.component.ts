import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EXPERIENCE_ROUTE } from 'src/app/app.routes';
import { LanguageService } from 'src/app/shared/language.service';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { DotComponent } from '../../shared/dot/dot.component';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';
import { Language } from 'src/app/shared/language.type';

@Component({
  selector: 'app-availability',
  imports: [DotComponent],
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.scss',
  host: { class: 'g-grid-item-start-aligned g-grid-item-shadow' },
})
export class AvailabilityComponent extends GridItemDirective {
  /**
   * Handle routing
   */
  private router = inject(Router);

  /**
   * Database service
   */
  private supabase = inject(SupabaseService);

  /**
   * Language service
   */
  private languageService = inject(LanguageService);

  /**
   * Current availability status
   */
  public current = signal<string>('');

  /**
   * Next availability status
   */
  public next = signal<string>('');

  /**
   * Constructor
   */
  constructor() {
    super();
    effect(() => {
      const lang = this.languageService.currentLang();
      this.updateAvailability(lang);
    });
  }

  /** Redirect to experience page */
  @HostListener('click') link() {
    this.router.navigate([EXPERIENCE_ROUTE]);
  }

  /** Fetches availability text from Supabase and updates the signals. */
  private async updateAvailability(lang: Language) {
    const { current, next } = await this.supabase.getAvailabilityItems(lang);
    this.current.set(current);
    this.next.set(next);
  }
}
