import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SelectableItem } from '../../is-selected/selectable-item.model';
import { OutsideClickDirective } from '../../outside-click.directive';
import { ActivableChipComponent } from '../activable-chip/activable-chip.component';
import { DetailsMenuComponent } from './details-menu/details-menu.component';

@Component({
  selector: 'app-filter-chip',
  standalone: true,
  imports: [MatIconModule, DetailsMenuComponent],
  templateUrl: './filter-chip.component.html',
  styleUrl: './filter-chip.component.scss',
  hostDirectives: [
    { directive: OutsideClickDirective, outputs: ['outsideClick'] },
  ],
})
export class FilterChipComponent extends ActivableChipComponent {
  /**
   * Est-ce que le menu doit être ouvert
   */
  public menuIsOpen = false;

  /**
   * Options à proposer
   */
  @Input({ required: true }) options: Array<SelectableItem> = [];

  /**
   * Options sélectionnées
   */
  @Input({ required: true }) selectedOptions: Array<SelectableItem> = [];

  /**
   * Texte à afficher
   */
  @Input() header: string = 'Sélectionnez une option';

  /**
   * Une option a été selectionnée
   *
   * Id -1 = "Tout" selectionner
   */
  @Output() selected: EventEmitter<SelectableItem> = new EventEmitter();

  /**
   * Action lors d'un click sur l'élément
   */
  @HostListener('click')
  onClick() {
    if (this.menuIsOpen) return;
    this.toggleMenu();
  }

  /**
   * Action lors d'un click en dehors de l'élément
   */
  @HostListener('outsideClick') outsideClick() {
    this.closeMenu();
  }

  /**
   * Sélectionne l'option
   * @param option
   */
  public select(option: SelectableItem) {
    this.selected.emit(option);
    this.toggleMenu();
  }

  /**
   * Ouvre/Ferme le menu
   */
  public toggleMenu() {
    this.menuIsOpen = !this.menuIsOpen;
  }

  /**
   *
   */
  public closeMenu() {
    this.menuIsOpen = false;
  }
}
