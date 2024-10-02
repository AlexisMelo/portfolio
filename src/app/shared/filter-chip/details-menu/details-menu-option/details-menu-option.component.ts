import { Component, HostBinding, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { SelectableItem } from 'src/app/shared/is-selected/selectable-item.model';

@Component({
  selector: 'app-details-menu-option',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './details-menu-option.component.html',
  styleUrl: './details-menu-option.component.scss',
})
export class DetailsMenuOptionComponent {
  /**
   * Option à afficher
   */
  @Input({ required: true }) option!: SelectableItem;

  /**
   * Est-ce que l'option doit être sélectionnée ?
   */
  @HostBinding('class.active') @Input() active?: boolean = false;
}
