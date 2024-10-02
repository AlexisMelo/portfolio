import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectableItem } from '../../is-selected/selectable-item.model';
import { DetailsMenuOptionComponent } from './details-menu-option/details-menu-option.component';
import { IsSelectedPipe } from '../../is-selected/is-selected.pipe';

@Component({
  selector: 'app-details-menu',
  standalone: true,
  imports: [DetailsMenuOptionComponent, IsSelectedPipe],
  templateUrl: './details-menu.component.html',
  styleUrl: './details-menu.component.scss',
})
export class DetailsMenuComponent {
  /**
   * Option "Tout sélectionner"
   */
  public selectAllOption: SelectableItem = { id: -1, label: 'Tout' };

  /**
   * Options à proposer
   */
  @Input({ required: true }) options: Array<SelectableItem> = [];

  /**
   * Options sélectionnées
   */
  @Input({ required: true }) selectedOptions: Array<SelectableItem> = [];

  /**
   * Titre à mettre dans le header
   */
  @Input({ required: true }) header!: string;

  /**
   * Une option a été selectionnée
   *
   * Id -1 = "Tout" selectionner
   */
  @Output() selected: EventEmitter<SelectableItem> = new EventEmitter();

  /**
   * Sélectionne une option
   * @param option
   */
  public select(event: MouseEvent | KeyboardEvent, option: SelectableItem) {
    event.preventDefault();
    event.stopPropagation();
    this.selected.emit(option);
  }
}
