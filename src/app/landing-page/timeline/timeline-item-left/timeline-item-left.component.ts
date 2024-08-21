import { Component, Input } from '@angular/core';
import { Context } from '../context.model';
import { LeftArrowComponent } from '../left-arrow/left-arrow.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-timeline-item-left',
  standalone: true,
  imports: [LeftArrowComponent, DatePipe],
  templateUrl: './timeline-item-left.component.html',
  styleUrl: './timeline-item-left.component.scss'
})
export class TimelineItemLeftComponent {
  /**
   * Item to display
   */
  @Input({required: true}) item!: Context; 
}
