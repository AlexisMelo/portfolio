import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { GithubComponent } from '../home/github/github.component';
import { LinkedinComponent } from '../home/linkedin/linkedin.component';
import { ContentService } from '../shared/content.service';
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
    LinkedinComponent,
    GithubComponent,
    ThemeSelectorComponent,
    LanguageSelectorComponent,
    NgTemplateOutlet,
    NgOptimizedImage,
    TranslocoPipe,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  hostDirectives: [StickyObserverDirective],
  host: { '[class.menu-opened]': 'menuOpened()' },
})
export class NavbarComponent implements OnInit, OnDestroy {
  /**
   * Content service
   */
  public contentService = inject(ContentService);

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
   * Ouvre le menu
   */
  public toggleMenu() {
    this.menuOpened.update(opened => !opened);
  }
}
