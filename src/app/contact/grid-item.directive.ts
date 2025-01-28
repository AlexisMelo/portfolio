import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appGridItem]',
  standalone: true,
})
export class GridItemDirective {
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
  @HostBinding('class') gridItem = 'grid-item';
}
