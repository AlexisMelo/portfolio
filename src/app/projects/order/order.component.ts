import { Component, effect, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { OrderDirection, ProjectsService } from '../projects.service';

@Component({
  selector: 'app-order',
  imports: [MatIconModule, TranslocoPipe],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent extends GridItemDirective {
  /**
   * Projects and their order
   */
  protected projectsService = inject(ProjectsService);

  /**
   * Toggle sort direction
   */
  @HostListener('click') onClick() {
    this.projectsService.orderDirection.set(
      this.projectsService.orderDirection() === 'asc' ? 'desc' : 'asc'
    );
  }

  /**
   * Constructor
   */
  constructor() {
    super();
    effect(() => {
      localStorage.setItem(
        'orderDirection',
        this.projectsService.orderDirection()
      );
    });

    const orderDirection = localStorage.getItem('orderDirection');
    if (orderDirection) {
      this.projectsService.orderDirection.set(orderDirection as OrderDirection);
    }
  }
}
