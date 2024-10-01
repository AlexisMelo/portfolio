import { Component } from '@angular/core';
import { ActivableChipComponent } from '../activable-chip/activable-chip.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter-chip',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './filter-chip.component.html',
  styleUrl: './filter-chip.component.scss',
})
export class FilterChipComponent extends ActivableChipComponent {}
