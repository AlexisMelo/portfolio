import { Component, HostListener, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ContentService } from 'src/app/shared/content.service';
import { ThemeService } from 'src/app/shared/theme.service';

@Component({
  selector: 'app-github',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './github.component.html',
  styleUrl: './github.component.scss',
})
export class GithubComponent {
  /**
   * Link to wanted repository
   */
  @Input({ required: true }) link!: string | null;

  /**
   * Handle content
   */
  public contentService = inject(ContentService);

  /**
   * Handle theming
   */
  public themeService = inject(ThemeService);

  /**
   * Action when clicking on component
   */
  @HostListener('click') click() {
    this.openGithub();
  }

  /**
   * Open github
   */
  public openGithub() {
    if (!this.link) return;
    window.open(this.link, '_blank');
  }
}
