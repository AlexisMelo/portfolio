import { Component, inject, Input } from '@angular/core';
import { ContentService } from 'src/app/shared/content.service';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { GridItemDirective } from '../grid-item.directive';

@Component({
  selector: 'app-github',
  standalone: true,
  imports: [ActionButtonComponent],
  templateUrl: './github.component.html',
  styleUrl: './github.component.scss',
})
export class GithubComponent extends GridItemDirective {
  /**
   * Lien vers le repo voulu
   */
  @Input({ required: true }) link!: string;

  /**
   * Gestion du contenu
   */
  public contentService = inject(ContentService);

  /**
   * Ouvre Github
   */
  public openGithub() {
    window.open(this.link, '_blank');
  }
}
