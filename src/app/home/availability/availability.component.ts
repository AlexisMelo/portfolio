import { Component, HostListener, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';
import { DotComponent } from '../../shared/dot/dot.component';
import { Router } from '@angular/router';
import { EXPERIENCE_ROUTE } from 'src/app/app.routes';

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [DotComponent],
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.scss',
  host: { class: 'g-grid-item-start-aligned g-grid-item-shadow' },
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
   * Handle routing
   */
  private router = inject(Router);

  /**
   * Constructeur
   */
  constructor() {
    super();
    this.nextAvailability = this.sanitizer.bypassSecurityTrustHtml(
      'Libre à partir de Juin 2026'
    );

    this.currentOccupation = this.sanitizer.bypassSecurityTrustHtml(
      "Aujourd'hui chez Bosch, Mondeville"
    );
  }

  /**
   * Redirect to experience page
   */
  @HostListener('click') link() {
    this.router.navigate([EXPERIENCE_ROUTE]);
  }
}
