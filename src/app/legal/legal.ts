import { Component, computed, inject, resource } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ContentService } from '../shared/content.service';
import { GridDragDirective } from '../shared/grid/grid-drag.directive';
import { GridEntranceDirective } from '../shared/grid/grid-entrance.directive';
import { GridItemDirective } from '../shared/grid/grid-item.directive';
import { LanguageService } from '../shared/language.service';
import { SupabaseService } from '../shared/supabase.service';
import { LegalInfos } from './legal-info';
import { LegalSection } from './legal-section/legal-section';

/**
 * Legal page: publisher, host, personal data and cookies
 */
@Component({
  selector: 'app-legal',
  imports: [
    LegalSection,
    GridItemDirective,
    GridEntranceDirective,
    GridDragDirective,
    TranslocoPipe,
  ],
  templateUrl: './legal.html',
  styleUrl: './legal.scss',
})
export class Legal {
  /**
   * Mail and phone of the publisher
   */
  protected readonly contentService = inject(ContentService);

  /**
   * Handle database
   */
  private readonly supabaseService = inject(SupabaseService);

  /**
   * Current language
   */
  private readonly lang = inject(LanguageService).currentLang;

  /**
   * Information of the page, loaded again when the language changes
   */
  private readonly infos = resource({
    params: () => this.lang(),
    loader: ({ params }) => this.supabaseService.getLegalInfos(params),
  });

  /**
   * Information of the page, empty until it is loaded
   */
  protected readonly info = computed<LegalInfos>(() =>
    this.infos.hasValue() ? this.infos.value() : {}
  );
}
