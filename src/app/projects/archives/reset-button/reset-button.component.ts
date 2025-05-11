import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reset-button',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './reset-button.component.html',
  styleUrl: './reset-button.component.scss',
})
export class ResetButtonComponent {}
