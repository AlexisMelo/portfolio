import { Component, inject } from '@angular/core';
import { ThemeService } from 'src/app/shared/theme.service';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { GridItemDirective } from '../grid-item.directive';
import { ContentService } from 'src/app/shared/content.service';

@Component({
  selector: 'app-github',
  standalone: true,
  imports: [ActionButtonComponent],
  templateUrl: './github.component.html',
  styleUrl: './github.component.scss',
})
export class GithubComponent extends GridItemDirective {
  /**
   * Gestion du thème
   */
  public themeService = inject(ThemeService);

  /**
   * Gestion du contenu
   */
  public contentService = inject(ContentService);

  /**
   * Ouvre Github
   */
  public openGithub() {
    window.open(this.contentService.github, '_blank');
  }
}
