import {
  Component,
  HostBinding,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { GithubComponent } from '../home/github/github.component';
import { LinkedinComponent } from '../home/linkedin/linkedin.component';
import { GridItemDirective } from '../shared/grid/grid-item.directive';
import { ThemeService } from '../shared/theme.service';
import { ContentService } from '../shared/content.service';
import { ThemeSelectorComponent } from './theme-selector/theme-selector.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { StickyObserverDirective } from './sticky-observer.directive';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
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
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  hostDirectives: [StickyObserverDirective],
})
export class NavbarComponent implements OnInit, OnDestroy {
  /**
   * Content service
   */
  public contentService = inject(ContentService);

  /**
   * Est-ce que le menu est ouvert
   */
  @HostBinding('class.menu-opened') public menuOpened: boolean = false;

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
      next: () => (this.menuOpened = false),
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
    this.menuOpened = !this.menuOpened;
  }
}
