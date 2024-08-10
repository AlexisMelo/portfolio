import { Component, Input } from '@angular/core';
import { TimelineItem } from '../timeline-item.model';
import { RightArrowComponent } from "../right-arrow/right-arrow.component";

@Component({
  selector: 'app-timeline-item-right',
  standalone: true,
  imports: [RightArrowComponent],
  templateUrl: './timeline-item-right.component.html',
  styleUrl: './timeline-item-right.component.scss'
})
export class TimelineItemRightComponent {
  /**
   * Item to display
   */
  @Input({required: true}) item!: TimelineItem; 
}
