import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { ActionButtonComponent } from '../../../contact/action-button/action-button.component';
import { Project } from '../../project.model';
import { StatusPipe } from '../../status/status.pipe';

@Component({
  selector: 'app-project-condensed-item',
  standalone: true,
  imports: [
    ActionButtonComponent,
    RouterLink,
    DatePipe,
    StatusPipe,
    MatIconModule,
  ],
  templateUrl: './project-condensed-item.component.html',
  styleUrl: './project-condensed-item.component.scss',
  host: { class: 'g-grid-item-start-aligned' },
})
export class ProjectCondensedItemComponent extends GridItemDirective {
  /**
   * Project to display
   */
  @Input({ required: true }) project!: Project;
}
