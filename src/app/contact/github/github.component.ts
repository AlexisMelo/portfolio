import { Component, inject, Input } from '@angular/core';
import { ContentService } from 'src/app/shared/content.service';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-github',
  standalone: true,
  imports: [ActionButtonComponent, MatIconModule],
  templateUrl: './github.component.html',
  styleUrl: './github.component.scss',
})
export class GithubComponent extends GridItemDirective {
  /**
   * Lien vers le repo voulu
   */
  @Input({ required: true }) link!: string | null;

  /**
   * Gestion du contenu
   */
  public contentService = inject(ContentService);

  /**
   * Ouvre Github
   */
  public openGithub() {
    if (!this.link) return;
    window.open(this.link, '_blank');
  }
}
