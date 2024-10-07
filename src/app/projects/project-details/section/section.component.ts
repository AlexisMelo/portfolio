import { Component, HostBinding, Input } from '@angular/core';
import { Section } from '../../section.model';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [],
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss',
})
export class SectionComponent {
  /**
   * Section à afficher
   */
  @Input({ required: true }) section!: Section;

  /**
   * Orientation de la section
   */
  @HostBinding('class') @Input() position: 'left' | 'right' = 'right';
}
