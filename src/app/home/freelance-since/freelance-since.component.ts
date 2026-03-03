import { Component, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { Router } from '@angular/router';
import { EXPERIENCE_ROUTE } from 'src/app/app.routes';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-freelance-since',
  imports: [MatIconModule, TranslocoPipe],
  templateUrl: './freelance-since.component.html',
  styleUrl: './freelance-since.component.scss',
  host: { class: 'g-grid-item-start-aligned g-grid-item-shadow' },
})
export class FreelanceSinceComponent extends GridItemDirective {
  /**
   * Handle routing
   */
  private router = inject(Router);

  /**
   * On click
   */
  @HostListener('click') onClick() {
    this.router.navigate([EXPERIENCE_ROUTE]);
  }
}
