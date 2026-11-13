import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocialLinkComponent } from '../home/social-link/social-link.component';
import { GridItemDirective } from '../shared/grid/grid-item.directive';
import { ThemeService } from '../shared/theme.service';
import { StickyObserverDirective } from './sticky-observer.directive';
import { ThemeSelectorComponent } from './theme-selector/theme-selector.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';

@Component({
  selector: 'app-navbar',
  imports: [
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    GridItemDirective,
    SocialLinkComponent,
    ThemeSelectorComponent,
    LanguageSelectorComponent,
    NgTemplateOutlet,
    NgOptimizedImage,
    TranslocoPipe,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  hostDirectives: [StickyObserverDirective],
  host: {
    '[class.menu-opened]': 'menuOpened()',
    '(keydown.escape)': 'closeMenu()',
  },
})
export class NavbarComponent implements OnInit, OnDestroy {
  /**
   * Est-ce que le menu est ouvert
   */
  protected readonly menuOpened = signal(false);

  /**
   * Gestion du thème
   */
  public themeService = inject(ThemeService);

  /**
   * Gestion des routes
   */
  private router = inject(Router);

  /**
   * Souscription aux changements de routes
   */
  private routerSubscription?: Subscription;

  /**
   * Button that opens and closes the menu on small screens
   */
  private readonly menuButton =
    viewChild.required<ElementRef<HTMLButtonElement>>('menuButton');

  /**
   * Menu on small screens
   */
  private readonly mobileMenu =
    viewChild.required<ElementRef<HTMLElement>>('mobileMenu');

  /**
   * Injector for the render callback that follows the opening of the menu
   */
  private readonly injector = inject(Injector);

  /**
   * Implémentation de OnInit
   */

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe({
      next: () => this.menuOpened.set(false),
    });
  }

  /**
   * Implémentation de OnDestroy
   */
  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  /**
   * Change le thème de l'app
   */
  public toggleDarkMode() {
    this.themeService.toggle();
  }

  /**
   * Opens or closes the menu. Once open, the focus goes to its first link: the menu comes
   * before the button in the page, so the next Tab would otherwise go to the page behind it.
   */
  public toggleMenu() {
    this.menuOpened.update(opened => !opened);

    if (this.menuOpened()) {
      afterNextRender(
        () =>
          this.mobileMenu()
            .nativeElement.querySelector<HTMLElement>('a[href]')
            ?.focus(),
        { injector: this.injector }
      );
    }
  }

  /**
   * Closes the menu with the Escape key, and gives the focus back to its button
   */
  protected closeMenu() {
    if (!this.menuOpened()) return;

    this.menuOpened.set(false);
    this.menuButton().nativeElement.focus();
  }
}
