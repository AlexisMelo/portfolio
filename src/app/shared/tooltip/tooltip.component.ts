import { Component, HostBinding } from '@angular/core';
import { TooltipPosition } from './tooltip-position.model';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
})
export class TooltipComponent {
  /**
   * Contenu à afficher
   */
  public tooltip: string = '';

  /**
   * Position du tooltip par rapport à l'élément
   */
  @HostBinding('class') public position: TooltipPosition = 'above';

  /**
   * Est-ce que le tooltip est visible
   */
  @HostBinding('class.visible') visibility: boolean = false;

  /**
   * Décalage à gauche
   */
  left: number = 0;

  /**
   * Décalage en haut
   */
  top: number = 0;

  /**
   * Associer le décalage top au css du composant
   */
  @HostBinding('style.top') get topStyle() {
    return this.top + 'px';
  }

  /**
   * Associer le décalage gauche au css du composant
   */
  @HostBinding('style.left') get leftStyle() {
    return this.left + 'px';
  }
}
