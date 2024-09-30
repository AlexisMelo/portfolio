import {
  Component,
  HostBinding,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../shared/theme.service';
import { NgTemplateOutlet } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, RouterLink, RouterLinkActive, NgTemplateOutlet],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
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
