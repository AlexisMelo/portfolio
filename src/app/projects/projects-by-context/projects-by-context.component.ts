import { Component } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-projects-by-context',
  standalone: true,
  imports: [],
  templateUrl: './projects-by-context.component.html',
  styleUrl: './projects-by-context.component.scss',
})
export class ProjectsByContextComponent extends GridItemDirective {}
