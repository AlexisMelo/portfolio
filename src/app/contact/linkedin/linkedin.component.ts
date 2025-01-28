import { Component } from '@angular/core';
import { ActionButtonComponent } from '../action-button/action-button.component';

@Component({
  selector: 'app-linkedin',
  standalone: true,
  imports: [ActionButtonComponent],
  templateUrl: './linkedin.component.html',
  styleUrl: './linkedin.component.scss',
})
export class LinkedinComponent {}
