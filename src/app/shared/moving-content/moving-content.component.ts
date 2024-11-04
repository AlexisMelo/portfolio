import { NgTemplateOutlet } from '@angular/common';
import { Component, HostBinding, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-moving-content',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './moving-content.component.html',
  styleUrl: './moving-content.component.scss',
})
export class MovingContentComponent {
  /**
   * Données à faire looper
   */
  @Input({ required: true }) temp!: TemplateRef<unknown>;

  /**
   * Afficher ou non un style "fade" au composant
   */
  @HostBinding('class.shouldFade') @Input() fade = false;

  /**
   * Temps en secondes de l'animation (= vitesse du défilement)
   */
  @Input() animationDuration = 20;

  /**
   * Doit-on utiliser la couleur de fade secondaire ? Pour les endroits où le background n'est pas celui par défaut
   */
  @HostBinding('class.useAltFadeColor') @Input() useAltFadeColor = false;

  /**
   * Espacement entre les éléments
   */
  @Input() gap = '20px';
}
