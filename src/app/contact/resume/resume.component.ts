import { Component } from '@angular/core';
import { GridItemDirective } from '../grid-item.directive';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss',
})
export class ResumeComponent extends GridItemDirective {}
