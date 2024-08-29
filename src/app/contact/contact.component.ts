import { Component } from '@angular/core';
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
  public send() {
    alert("ça fait rien pour l'instant désolé, juste envoie moi un mail ...");
  }
}
