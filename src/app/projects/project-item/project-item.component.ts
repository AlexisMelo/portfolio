import { DatePipe, SlicePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { HighlightableChipComponent } from 'src/app/shared/chips/highlightable-chip/highlightable-chip.component';
import { SuggestionChipComponent } from '../../shared/chips/suggestion-chip/suggestion-chip.component';
import { DurationPipe } from '../duration.pipe';
import { Project } from '../project.model';
import { StatusPipe } from '../status/status.pipe';

@Component({
  selector: 'app-project-item',
  standalone: true,
  imports: [
    SuggestionChipComponent,
    DatePipe,
    MatIcon,
    DurationPipe,
    RouterLink,
    StatusPipe,
    HighlightableChipComponent,
    SlicePipe,
  ],
  templateUrl: './project-item.component.html',
  styleUrl: './project-item.component.scss',
})
export class ProjectItemComponent {
  /**
   * Project to display
   */
  @Input({ required: true }) project!: Project;
}
