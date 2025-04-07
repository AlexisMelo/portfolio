import { Component } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-skill-highlight-placeholder',
  standalone: true,
  imports: [],
  templateUrl: './skill-highlight-placeholder.component.html',
  styleUrl: './skill-highlight-placeholder.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class SkillHighlightPlaceholderComponent extends GridItemDirective {}
