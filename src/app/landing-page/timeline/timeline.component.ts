import { Component } from '@angular/core';
import { TimelineItem } from './timeline-item.model';
import { TimelineItemRightComponent } from './timeline-item-right/timeline-item-right.component';
import { TimelineItemLeftComponent } from './timeline-item-left/timeline-item-left.component';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [TimelineItemRightComponent, TimelineItemLeftComponent],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent {
  /**
   * List of all items to display
   */
  private items: Array<TimelineItem> = [{
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
  },
  {
    id: 4,
    date: 2022,
    job: 'Développeur web fullstack',
    localisation: 'Mont-Saint-Aignan',
    company: 'Invoke',
    type: 'Job'
  },
  {
    id: 5,
    date: 2021,
    job: 'Développeur web frontend',
    localisation: 'Caen',
    company: 'Orange Labs',
    type: 'Job'
  },
  {
    id: 6,
    date: 2019,
    job: 'DUT Informatique',
    localisation: 'Caen',
    company: 'Université',
    type: 'School'
  },
  {
    id: 7,
    date: 2019,
    job: 'Développeur logiciel',
    localisation: 'Giberville',
    company: 'Actility',
    type: 'Job'
  },
  {
    id: 8,
    date: 2017,
    job: 'Baccalauréat scientifique, section europ. & spé. ISN',
    localisation: 'L\'Aigle',
    company: 'Lycée Napoléon',
    type: 'School'
  }]

  /**
   * Items to display, without the last
   */
  get timelineItems() {
    return this.items.slice(0, -1);
  }

  /**
   * Last item to display
   */
  get lastItem() {
    return this.items.slice(-1)[0];
  }
}
