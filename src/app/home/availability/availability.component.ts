import { Component, HostListener, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';
import { DotComponent } from '../../shared/dot/dot.component';
import { Router } from '@angular/router';
import { EXPERIENCE_ROUTE } from 'src/app/app.routes';

@Component({
  selector: 'app-availability',
  imports: [DotComponent, TranslocoPipe],
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.scss',
  host: { class: 'g-grid-item-start-aligned g-grid-item-shadow' },
})
export class AvailabilityComponent extends GridItemDirective {
  /**
   * Handle routing
   */
  private router = inject(Router);

  /**
   * Redirect to experience page
   */
  @HostListener('click') link() {
    this.router.navigate([EXPERIENCE_ROUTE]);
  }
}
