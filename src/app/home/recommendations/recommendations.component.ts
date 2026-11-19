import { NgOptimizedImage } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  resource,
  signal,
  viewChildren,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LanguageService } from 'src/app/shared/language.service';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { ActionButtonComponent } from '../action-button/action-button.component';

/**
 * A recommendation as the tile displays it, in the active language
 */
interface DisplayedRecommendation {
  /** Id of the recommendation */
  id: string;

  /** Full name of its author */
  name: string;

  /** Drawing of its author's head */
  avatar: string;

  /** Text of the recommendation */
  text: string;

  /** Link to the recommendation on LinkedIn, where it can be read in full */
  link: string | null;
}

/**
 * Drawing displayed for an author who has none
 */
const DEFAULT_AVATAR = 'photos/empty-avatar.webp';

/**
 * Number given to the next tile, so that each one has its own element ids
 */
let nextRecommendationsId = 0;

/**
 * Tile showing the LinkedIn recommendations of my ex-colleagues, one at a time: a sticker label on
 * the top left and, next to it, the drawn heads of their authors as tabs (ARIA tabs pattern). The
 * selected recommendation shows its author's name, as much of its text as the tile has room for,
 * and a link to read it in full on LinkedIn.
 */
@Component({
  selector: 'app-recommendations',
  imports: [ActionButtonComponent, NgOptimizedImage, TranslocoPipe],
  templateUrl: './recommendations.component.html',
  styleUrl: './recommendations.component.scss',
})
export class RecommendationsComponent extends GridItemDirective {
  /**
   * Database service
   */
  private readonly supabaseService = inject(SupabaseService);

  /**
   * Single source of truth for the active language
   */
  private readonly languageService = inject(LanguageService);

  /**
   * Recommendations with their text in every language, fetched once
   */
  private readonly recommendationsResource = resource({
    loader: () => this.supabaseService.getRecommendations(),
  });

  /**
   * Recommendations in the active language, empty until they are loaded
   */
  protected readonly recommendations = computed<DisplayedRecommendation[]>(
    () => {
      if (!this.recommendationsResource.hasValue()) return [];

      const lang = this.languageService.currentLang();
      return this.recommendationsResource.value().map(recommendation => {
        const { coworker, localizedText } = recommendation;
        return {
          id: recommendation.id,
          name: [coworker.firstname, coworker.lastname]
            .filter(Boolean)
            .join(' '),
          avatar: coworker.avatar_head ?? DEFAULT_AVATAR,
          text:
            localizedText?.[lang] ??
            localizedText?.en ??
            localizedText?.fr ??
            '',
          link: recommendation.link,
        };
      });
    }
  );

  /**
   * Index of the displayed recommendation
   */
  protected readonly selectedIndex = signal(0);

  /**
   * Prefix of the ids of the tabs and panels, which link them to each other
   */
  private readonly idPrefix = `recommendations-${nextRecommendationsId++}`;

  /**
   * Id of the sticker label, which names the tab list
   */
  protected readonly labelId = `${this.idPrefix}-label`;

  /**
   * Tabs, to move the focus with the arrow keys
   */
  private readonly tabs = viewChildren<ElementRef<HTMLButtonElement>>('tab');

  /**
   * Quotes of the recommendations, whose number of lines follows their height
   */
  private readonly quotes = viewChildren<ElementRef<HTMLElement>>('quote');

  /**
   * Fits the number of lines of each quote to its height, which changes with the screen width and
   * when a visitor resizes the tile
   */
  constructor() {
    super();
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) this.fitLines(entry.target as HTMLElement);
    });
    inject(DestroyRef).onDestroy(() => observer.disconnect());

    afterRenderEffect(() => {
      observer.disconnect();
      for (const quote of this.quotes()) observer.observe(quote.nativeElement);
    });
  }

  /**
   * Id of the tab of a recommendation
   * @param index index of the recommendation
   */
  protected tabId(index: number): string {
    return `${this.idPrefix}-tab-${index}`;
  }

  /**
   * Id of the panel showing a recommendation
   * @param index index of the recommendation
   */
  protected panelId(index: number): string {
    return `${this.idPrefix}-panel-${index}`;
  }

  /**
   * Displays a recommendation
   * @param index index of the recommendation
   */
  protected select(index: number): void {
    this.selectedIndex.set(index);
  }

  /**
   * Moves to the previous or next tab with the left and right arrows (looping), to the first one
   * with Home and to the last one with End, displaying its recommendation
   */
  protected onTabKeydown(event: KeyboardEvent): void {
    const count = this.recommendations().length;
    const index = this.selectedIndex();
    const targets: Record<string, number> = {
      ArrowLeft: (index - 1 + count) % count,
      ArrowRight: (index + 1) % count,
      Home: 0,
      End: count - 1,
    };
    const target = targets[event.key];
    if (target === undefined) return;

    event.preventDefault();
    this.select(target);
    this.tabs()[target]?.nativeElement.focus();
  }

  /**
   * Gives the text of a quote as many lines as its height has room for: the last one ends with an
   * ellipsis when the text is longer
   * @param quote element of the quote, whose first child holds the text
   */
  private fitLines(quote: HTMLElement): void {
    const text = quote.firstElementChild;
    if (!text) return;

    const lineHeight = parseFloat(getComputedStyle(text).lineHeight);
    if (!lineHeight) return;

    const lines = Math.max(1, Math.floor(quote.clientHeight / lineHeight));
    quote.style.setProperty('--recommendations-lines', `${lines}`);
  }
}
