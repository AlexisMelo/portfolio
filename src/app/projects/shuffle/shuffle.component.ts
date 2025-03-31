import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-shuffle',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './shuffle.component.html',
  styleUrl: './shuffle.component.scss',
})
export class ShuffleComponent extends GridItemDirective {}
