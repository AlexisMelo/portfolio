import { Component, Input } from '@angular/core';
import { TimelineItem } from '../timeline-item.model';
import { LeftArrowComponent } from '../left-arrow/left-arrow.component';

@Component({
  selector: 'app-timeline-item-left',
  standalone: true,
  imports: [LeftArrowComponent],
  templateUrl: './timeline-item-left.component.html',
  styleUrl: './timeline-item-left.component.scss'
})
export class TimelineItemLeftComponent {
  /**
   * Item to display
   */
  @Input({required: true}) item!: TimelineItem; 
}
