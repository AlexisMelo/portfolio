import { Component } from '@angular/core';
import { GridItemDirective } from '../grid-item.directive';

@Component({
  selector: 'app-photo',
  standalone: true,
  imports: [],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.scss',
})
export class PhotoComponent extends GridItemDirective {}
