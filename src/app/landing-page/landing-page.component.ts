import { Component } from '@angular/core';
import { TimelineComponent } from './timeline/timeline.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [TimelineComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

}
