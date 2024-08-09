import { Component } from '@angular/core';
import { TimelineItem } from './timeline-item.model';
import { TimelineItemRightComponent } from './timeline-item-right/timeline-item-right.component';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [TimelineItemRightComponent],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent {
  /**
   * List of all items to display
   */
  public timelineItems: Array<TimelineItem> = [{
    id: 1,
    date: 2024,
    job: 'Développeur web freelance',
    localisation: 'Caen',
    company: 'Melo',
    type: 'Job'
  },
  {
    id: 2,
    date: 2022,
    job: 'Ingénieur process traçabilité & transformation digitale',
    localisation: 'Mondeville',
    company: 'Bosch',
    type: 'Job'
  },
  {
    id: 3,
    date: 2022,
    job: 'Ingénieur - Architecte des systèmes d’information',
    localisation: 'Rouen',
    company: 'INSA',
    type: 'School'
  }]
}
