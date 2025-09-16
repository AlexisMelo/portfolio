import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ContentService } from '../shared/content.service';
import { DescriptionComponent } from './description/description.component';
import { GithubComponent } from './github/github.component';
import { LinkedinComponent } from './linkedin/linkedin.component';
import { MailComponent } from './mail/mail.component';
import { MapComponent } from './map/map.component';
import { NowComponent } from './now/now.component';
import { ResumeComponent } from './resume/resume.component';
import { AvailabilityComponent } from './availability/availability.component';
import { ImageComponent } from './image/image.component';
import { FreelanceSinceComponent } from './freelance-since/freelance-since.component';
import { gridItemAnimation } from '../shared/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatIconModule,
    LinkedinComponent,
    GithubComponent,
    MailComponent,
    DescriptionComponent,
    ResumeComponent,
    MapComponent,
    NowComponent,
    AvailabilityComponent,
    ImageComponent,
    FreelanceSinceComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [gridItemAnimation],
})
export class HomeComponent {
  /**
   * Gestion du contenu
   */
  public contentService = inject(ContentService);
}
