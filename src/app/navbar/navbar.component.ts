import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../shared/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  /**
   * Constructeur
   */
  constructor(public themeService: ThemeService) {}

  /**
   * Active / Désactive le dark mode
   */

  public toggleDarkMode() {
    this.themeService.toggle();
  }
}
