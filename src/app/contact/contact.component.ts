import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ContentService } from '../shared/content.service';
import { DescriptionComponent } from './description/description.component';
import { GithubComponent } from './github/github.component';
import { LinkedinComponent } from './linkedin/linkedin.component';
import { MailComponent } from './mail/mail.component';
import { MapComponent } from './map/map.component';
import { PhoneComponent } from './phone/phone.component';
import { ResumeComponent } from './resume/resume.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    MatIconModule,
    LinkedinComponent,
    GithubComponent,
    MailComponent,
    PhoneComponent,
    DescriptionComponent,
    ResumeComponent,
    MapComponent,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  /**
   * Gestion du contenu
   */
  public contentService = inject(ContentService);
}
