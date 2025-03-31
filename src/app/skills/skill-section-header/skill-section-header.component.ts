import { Component } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-skill-section-header',
  standalone: true,
  imports: [],
  templateUrl: './skill-section-header.component.html',
  styleUrl: './skill-section-header.component.scss',
})
export class SkillSectionHeaderComponent extends GridItemDirective {}
