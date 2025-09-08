import { Component, HostListener, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ContentService } from 'src/app/shared/content.service';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';

@Component({
  selector: 'app-github',
  standalone: true,
  imports: [MatIconModule],
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
   * Action when clicking on component
   */
  @HostListener('click') click() {
    this.openGithub();
  }

  /**
   * Ouvre Github
   */
  public openGithub() {
    if (!this.link) return;
    window.open(this.link, '_blank');
  }
}
