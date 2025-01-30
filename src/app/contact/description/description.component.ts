import { Component } from '@angular/core';
import { GridItemDirective } from '../grid-item.directive';

@Component({
  selector: 'app-description',
  standalone: true,
  imports: [],
  templateUrl: './description.component.html',
  styleUrl: './description.component.scss',
})
export class DescriptionComponent extends GridItemDirective {}
