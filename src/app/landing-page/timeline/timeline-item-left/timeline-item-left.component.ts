import { Component, Input } from '@angular/core';
import { Context } from '../context.model';
import { LeftArrowComponent } from '../left-arrow/left-arrow.component';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';

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
   * Route vers les archives
   */
  public ARCHIVES_ROUTE = ARCHIVES_ROUTE;

  /**
   * Item to display
   */
  @Input({ required: true }) item!: Context;
}
