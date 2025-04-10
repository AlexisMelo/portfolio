import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';
import { ActionButtonComponent } from 'src/app/contact/action-button/action-button.component';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-ongoing',
  standalone: true,
  imports: [ActionButtonComponent, RouterLink],
  templateUrl: './ongoing.component.html',
  styleUrl: './ongoing.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class OngoingComponent extends GridItemDirective {
  /**
   * Nombre de projets en cours
   */
  @Input({ required: true }) count!: number;

  /**
   * Chemin vers les archives
   */
  public ARCHIVES_ROUTE = ARCHIVES_ROUTE;
}
