import { Component, computed, inject, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ContentService } from 'src/app/shared/content.service';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { GithubComponent } from '../github/github.component';
import { LinkedinComponent } from '../linkedin/linkedin.component';

/**
 * Network a social link tile leads to
 */
export type SocialNetwork = 'linkedin' | 'github';

/**
 * Tile linking to one of my profiles, with the network's icon and name. The whole tile is the link.
 */
@Component({
  selector: 'app-social-link',
  imports: [GithubComponent, LinkedinComponent, TranslocoPipe],
  templateUrl: './social-link.component.html',
  styleUrl: './social-link.component.scss',
})
export class SocialLinkComponent extends GridItemDirective {
  /**
   * Network to link to
   */
  public readonly network = input.required<SocialNetwork>();

  /**
   * Content of the site, which holds the profile addresses
   */
  private readonly contentService = inject(ContentService);

  /**
   * Address of the profile
   */
  protected readonly href = computed(() =>
    this.network() === 'linkedin'
      ? this.contentService.linkedIn
      : this.contentService.github
  );
}
