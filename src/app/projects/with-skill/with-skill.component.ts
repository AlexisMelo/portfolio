import { Component } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

@Component({
  selector: 'app-with-skill',
  standalone: true,
  imports: [],
  templateUrl: './with-skill.component.html',
  styleUrl: './with-skill.component.scss',
})
export class WithSkillComponent extends GridItemDirective {}
