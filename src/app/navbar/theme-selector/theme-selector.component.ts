import { Component } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.scss',
})
export class ThemeSelectorComponent extends GridItemDirective {}
