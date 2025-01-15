import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title-separator',
  standalone: true,
  imports: [],
  templateUrl: './title-separator.component.html',
  styleUrl: './title-separator.component.scss',
})
export class TitleSeparatorComponent {
  /**
   * Titre
   */
  @Input({ required: true }) heading!: string;

  /**
   * Sous-titre
   */
  @Input({ required: true }) subtitle!: string;

  /**
   * Description courte de la section
   */
  @Input({ required: true }) description!: string;
}
