import { Component, Input } from '@angular/core';
import { Context } from '../context.model';
import { RightArrowComponent } from '../right-arrow/right-arrow.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-timeline-item-right',
  standalone: true,
  imports: [RightArrowComponent, DatePipe],
  templateUrl: './timeline-item-right.component.html',
  styleUrl: './timeline-item-right.component.scss',
})
export class TimelineItemRightComponent {
  /**
   * Date actuelle
   */
  public currentDate = new Date();

  /**
   * Item to display
   */
  @Input({ required: true }) item!: Context;
}
