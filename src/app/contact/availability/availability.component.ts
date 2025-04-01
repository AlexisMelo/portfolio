import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';
import { DotComponent } from '../../shared/dot/dot.component';

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [DotComponent],
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class AvailabilityComponent extends GridItemDirective {
  /**
   * Sanitizer
   */
  private sanitizer = inject(DomSanitizer);

  /**
   * Occupation actuelle
   */
  public currentOccupation?: SafeHtml;

  /**
   * Texte avec la disponibilité
   */
  public nextAvailability?: SafeHtml;

  /**
   * A l'écoute d'opportunité ?
   */
  public openForWork?: boolean;

  /**
   * Constructeur
   */
  constructor() {
    super();
    this.nextAvailability = this.sanitizer.bypassSecurityTrustHtml(
      'Libre à partir de Juin 2026'
    );

    this.currentOccupation = this.sanitizer.bypassSecurityTrustHtml(
      'Actuellement en CDI chez Bosch, Mondeville'
    );
  }
}
