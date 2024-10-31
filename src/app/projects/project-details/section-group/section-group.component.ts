import { Component, Input } from '@angular/core';
import { Section } from '../../section.model';
import { SectionComponent } from '../section/section.component';

@Component({
  selector: 'app-section-group',
  standalone: true,
  imports: [SectionComponent],
  templateUrl: './section-group.component.html',
  styleUrl: './section-group.component.scss',
})
export class SectionGroupComponent {
  /**
   * Sections à afficher
   */
  @Input({ required: true }) sections: Array<Section> = [];
}
