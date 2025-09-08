import { Component, inject } from '@angular/core';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';
import { ContentService } from 'src/app/shared/content.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-description',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './description.component.html',
  styleUrl: './description.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class DescriptionComponent extends GridItemDirective {}
