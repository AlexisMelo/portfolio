import { Component, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';
import { Router } from '@angular/router';
import { PROJECTS_ROUTE } from 'src/app/app.routes';

@Component({
  selector: 'app-description',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './description.component.html',
  styleUrl: './description.component.scss',
  host: { class: 'g-grid-item-shadow' },
})
export class DescriptionComponent extends GridItemDirective {
  /**
   * Handle routing
   */
  private router = inject(Router);

  /**
   * Redirect to experience page
   */
  @HostListener('click') link() {
    this.router.navigate([PROJECTS_ROUTE]);
  }
}
