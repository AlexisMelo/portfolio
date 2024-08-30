import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '../shared/input/input.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MatIconModule, InputComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  /**
   * Bouton pour confirmer le formulaire
   */
  @ViewChild('buttonBird') sendButton?: ElementRef;

  /**
   * Bouton pour confirmer le formulaire
   */
  public textBird: string = 'ENVOYER';

  /**
   * Action effectuée lors du submit du formulaire
   * @param event
   */
  submit(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.sendButton?.nativeElement.classList.add('active');
    this.textBird = 'ENVOYÉ';
  }
}
