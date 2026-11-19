import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, Signal, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { of, switchMap } from 'rxjs';

/**
 * Name opening every page title, before the page name
 */
const SITE_NAME = 'Alexis Melo da Silva';

/**
 * Route data key holding the translation key of the page's meta description
 */
export const DESCRIPTION_KEY = 'description';

/**
 * Page title and search snippet: the routes' `title` is a translation key, shown after the site
 * name ("Alexis Melo da Silva | À propos") in the active language. The meta description, social
 * card texts and canonical URL follow the page too.
 */
@Injectable({ providedIn: 'root' })
export class PageTitleStrategy extends TitleStrategy {
  /**
   * Browser tab title
   */
  private readonly title = inject(Title);

  /**
   * Meta tags of the document head
   */
  private readonly meta = inject(Meta);

  /**
   * Document, for the canonical link
   */
  private readonly document = inject(DOCUMENT);

  /**
   * Translations
   */
  private readonly transloco = inject(TranslocoService);

  /**
   * Translation key of the current page's name
   */
  private readonly pageKey = signal<string | undefined>(undefined);

  /**
   * Translation key of the current page's meta description
   */
  private readonly descriptionKey = signal<string | undefined>(undefined);

  /**
   * Name shown instead of the page name, already translated (a project's name on its page)
   */
  public readonly detail = signal<string | undefined>(undefined);

  /**
   * Current page name, translated again when the language changes
   */
  private readonly pageName = this.translated(this.pageKey);

  /**
   * Current page description, translated again when the language changes
   */
  private readonly description = this.translated(this.descriptionKey);

  /**
   * Constructor
   */
  constructor() {
    super();
    effect(() => {
      const page = this.detail() ?? this.pageName();
      const title = page ? `${SITE_NAME} | ${page}` : SITE_NAME;
      this.title.setTitle(title);
      this.meta.updateTag({ property: 'og:title', content: title });
    });
    effect(() => {
      const description = this.description();
      if (!description) return;
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
    });
  }

  /**
   * Called by the router after each navigation
   */
  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.pageKey.set(this.buildTitle(snapshot));
    let route = snapshot.root;
    while (route.firstChild) route = route.firstChild;
    this.descriptionKey.set(route.data[DESCRIPTION_KEY]);
    this.updateCanonical(snapshot.url);
  }

  /**
   * Points the canonical link and `og:url` at the page, without its query params
   */
  private updateCanonical(url: string): void {
    const href = new URL(
      url.split('?')[0].replace(/^\//, ''),
      this.document.baseURI
    ).href;
    this.meta.updateTag({ property: 'og:url', content: href });
    this.document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute('href', href);
  }

  /**
   * Translation of a key held by a signal, in the active language
   */
  private translated(key: Signal<string | undefined>) {
    return toSignal(
      toObservable(key).pipe(
        switchMap(k =>
          k ? this.transloco.selectTranslate<string>(k) : of(undefined)
        )
      )
    );
  }
}
