import { Component, Input } from '@angular/core';
import { Context } from '../context.model';
import { LeftArrowComponent } from '../left-arrow/left-arrow.component';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-timeline-item-left',
  standalone: true,
  imports: [LeftArrowComponent, DatePipe, RouterLink],
  templateUrl: './timeline-item-left.component.html',
  styleUrl: './timeline-item-left.component.scss',
})
export class TimelineItemLeftComponent {
  /**
   * Date actuelle
   */
  public currentDate = new Date();

  /**
   * Item to display
   */
  @Input({ required: true }) item!: Context;
}
