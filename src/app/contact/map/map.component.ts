import { Component } from '@angular/core';
import { GridItemDirective } from '../grid-item.directive';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent extends GridItemDirective {}
