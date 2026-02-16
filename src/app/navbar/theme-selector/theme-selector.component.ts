import { Component, HostListener, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ThemeService } from 'src/app/shared/theme.service';

@Component({
  selector: 'app-theme-selector',
  imports: [MatIcon],
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.scss',
})
export class ThemeSelectorComponent {
  /**
   * Handle theme
   */
  public themeService = inject(ThemeService);

  /**
   * Handle theme change
   */
  @HostListener('click') onClick() {
    this.themeService.toggle();
  }
}
