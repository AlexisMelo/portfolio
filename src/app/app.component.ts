import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import {
  trigger,
  transition,
  group,
  query,
  style,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('routeFade', [
      transition('* <=> *', [
        group([
          query(
            ':enter',
            [
              style({ opacity: 0 }),
              animate('400ms ease-in', style({ opacity: 1 })),
            ],
            { optional: true }
          ),
        ]),
      ]),
    ]),
  ],
})
export class AppComponent {
  prepareRoute(outlet: RouterOutlet) {
    return outlet.isActivated
      ? outlet.activatedRouteData['animation'] ||
          outlet.activatedRoute?.component?.name
      : null;
  }
}
