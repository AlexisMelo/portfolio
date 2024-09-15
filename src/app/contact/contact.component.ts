import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '../shared/input/input.component';
import { ContentService } from '../shared/content.service';

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
  public textBird: string = 'EN PANNE'; //'ENVOYER';

  /**
   * Gestion du contenu
   */
  public contentService = inject(ContentService);

  /**
   * Action effectuée lors du submit du formulaire
   * @param event
   */
  submit(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.sendButton?.nativeElement.classList.add('active');
    this.textBird = 'ENVOYÉ';
    alert(
      'Ne fonctionne pas encore... Envoie moi plutôt un mail directement !'
    );
  }

  /**
   * Ouvre google maps
   */
  public openMaps() {
    const win = window.open(
      'https://www.google.fr/maps/dir/49.16524,-0.310951/14000+Caen/@47.7223104,-5.3592267,5.67z/',
      '_blank'
    );
    win?.focus();
  }
}
