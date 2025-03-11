import { Component, Input } from '@angular/core';
import { Context } from '../context.model';
import { RightArrowComponent } from '../right-arrow/right-arrow.component';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';

@Component({
  selector: 'app-timeline-item-right',
  standalone: true,
  imports: [RightArrowComponent, DatePipe, RouterLink],
  templateUrl: './timeline-item-right.component.html',
  styleUrl: './timeline-item-right.component.scss',
})
export class TimelineItemRightComponent {
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
