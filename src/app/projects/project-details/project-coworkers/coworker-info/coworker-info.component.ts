import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ActionButtonComponent } from '../../../../home/action-button/action-button.component';

@Component({
  selector: 'app-coworker-info',
  imports: [ActionButtonComponent, TranslocoPipe, NgOptimizedImage],
  templateUrl: './coworker-info.component.html',
  styleUrl: './coworker-info.component.scss',
})
export class CoworkerInfoComponent {
  /**
   * Image à afficher
   */
  @Input({ required: true }) image!: string;

  /**
   * Nom à afficher
   */
  @Input({ required: true }) name!: string;

  /**
   * Rôle du coworker
   */
  @Input() description?: string | null;

  /**
   * Lien vers un linkedin, site web, ...
   */
  @Input() url?: string | null;
}
