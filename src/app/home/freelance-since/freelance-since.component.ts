import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-freelance-since',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './freelance-since.component.html',
  styleUrl: './freelance-since.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class FreelanceSinceComponent extends GridItemDirective {}
