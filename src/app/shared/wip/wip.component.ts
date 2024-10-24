import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MovingContentComponent } from '../moving-content/moving-content.component';

@Component({
  selector: 'app-wip',
  standalone: true,
  imports: [MatIcon, MovingContentComponent],
  templateUrl: './wip.component.html',
  styleUrl: './wip.component.scss',
})
export class WipComponent {}
