import { Component } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-key-header',
  standalone: true,
  imports: [],
  templateUrl: './key-header.component.html',
  styleUrl: './key-header.component.scss',
})
export class KeyHeaderComponent extends GridItemDirective {}
