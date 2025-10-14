import { Component } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-keep-learning',
  standalone: true,
  imports: [],
  templateUrl: './keep-learning.component.html',
  styleUrl: './keep-learning.component.scss',
  hostDirectives: [GridItemDirective],
})
export class KeepLearningComponent {}
