import { Component, HostListener } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.scss',
})
export class ThemeSelectorComponent extends GridItemDirective {
  /**
   * Handle theme change
   */
  @HostListener('click') onClick() {
    this.themeService.toggle();
  }
}
