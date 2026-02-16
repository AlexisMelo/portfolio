import { Component, Input } from '@angular/core';
import { ActionButtonComponent } from '../../../../home/action-button/action-button.component';

@Component({
  selector: 'app-coworker-info',
  imports: [ActionButtonComponent],
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

  /**
   * Ouvre l'url associée au profil
   * @returns
   */
  public openInfos() {
    if (!this.url) return;

    window.open(this.url, '_blank');
  }
}
