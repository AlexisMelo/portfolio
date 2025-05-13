import { Component } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LoaderComponent } from 'src/app/shared/loader/loader.component';

@Component({
  selector: 'app-skill-highlight-placeholder',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './skill-highlight-placeholder.component.html',
  styleUrl: './skill-highlight-placeholder.component.scss',
})
export class SkillHighlightPlaceholderComponent extends GridItemDirective {}
