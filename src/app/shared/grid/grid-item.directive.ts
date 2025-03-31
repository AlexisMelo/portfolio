import { Directive, HostBinding, HostListener, inject } from '@angular/core';
import { ThemeService } from '../theme.service';

@Directive({
  selector: '[appGridItem]',
  standalone: true,
})
export class GridItemDirective {
  /**
   * Gestion du thème
   */
  public themeService = inject(ThemeService);

  /**
   * Est-ce que le composant est actuellement survolé ?
   */
  public hovered: boolean = false;

  /**
   * Détection lorsque la souris rentre dans le composant
   */
  @HostListener('mouseenter') mouseEnter() {
    this.hovered = true;
  }

  /**
   * Détection lorsque la souris quitte le composant
   */
  @HostListener('mouseleave') mouseLeave() {
    this.hovered = false;
  }

  /**
   * Classe liée aux grid-items
   */
  @HostBinding('class') gridItem = 'g-grid-item';
}
