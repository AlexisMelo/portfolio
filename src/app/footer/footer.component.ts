import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LEGAL_ROUTE } from '../route-paths';

/**
 * Footer of every page: copyright and link to the legal page
 */
@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  /**
   * Legal page the footer links to
   */
  protected readonly LEGAL_ROUTE = LEGAL_ROUTE;
}
