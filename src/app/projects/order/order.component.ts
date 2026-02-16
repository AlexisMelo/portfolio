import { Component, effect, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { ArchivesService, OrderDirection } from '../archives/archives.service';

@Component({
  selector: 'app-order',
  imports: [MatIconModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent extends GridItemDirective {
  /**
   * Handle archives
   */
  protected archivesService = inject(ArchivesService);

  /**
   * Toggle sort direction
   */
  @HostListener('click') onClick() {
    this.archivesService.orderDirection.set(
      this.archivesService.orderDirection() === 'asc' ? 'desc' : 'asc'
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
        this.archivesService.orderDirection()
      );
    });

    const orderDirection = localStorage.getItem('orderDirection');
    if (orderDirection) {
      this.archivesService.orderDirection.set(orderDirection as OrderDirection);
    }
  }
}
