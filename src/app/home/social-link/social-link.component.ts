import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ContentService } from 'src/app/shared/content.service';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

/**
 * Network a social link tile leads to
 */
export type SocialNetwork = 'linkedin' | 'github';

/**
 * Tile linking to one of my profiles, or to another page of the network such as a project's
 * repository, with the network's icon and name. The whole tile is the link.
 */
@Component({
  selector: 'app-social-link',
  imports: [TranslocoPipe],
  templateUrl: './social-link.component.html',
  styleUrl: './social-link.component.scss',
  host: { '[class.icon-only]': 'iconOnly()' },
})
export class SocialLinkComponent extends GridItemDirective {
  /**
   * Network to link to
   */
  public readonly network = input.required<SocialNetwork>();

  /**
   * Address to open instead of my profile on the network, a project's repository for example
   */
  public readonly link = input<string>();

  /**
   * Translation key of the link's name, the network's name by default. Give one that says
   * where the link goes when it is not my profile.
   */
  public readonly labelKey = input<string>();

  /**
   * Shows only the icon, centred, for a tile one column wide. The name stays for assistive
   * technologies.
   */
  public readonly iconOnly = input(false, { transform: booleanAttribute });

  /**
   * Content of the site, which holds the profile addresses
   */
  private readonly contentService = inject(ContentService);

  /**
   * Address the link opens
   */
  protected readonly href = computed(
    () =>
      this.link() ??
      (this.network() === 'linkedin'
        ? this.contentService.linkedIn
        : this.contentService.github)
  );

  /**
   * Translation key of the link's name
   */
  protected readonly label = computed(
    () => this.labelKey() ?? `home.social.${this.network()}`
  );
}
