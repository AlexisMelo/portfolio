import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Context } from 'src/app/landing-page/timeline/context.model';

@Component({
  selector: 'app-context-item',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './context-item.component.html',
  styleUrl: './context-item.component.scss',
})
export class ContextItemComponent {
  /**
   * Context to display
   */
  @Input({ required: true }) context!: Context;
}
