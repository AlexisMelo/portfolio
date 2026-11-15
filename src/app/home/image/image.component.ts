import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';

/**
 * Poses of the avatar
 */
export type AvatarPose = 'arms-crossed' | 'shrugging';

/**
 * Coral tile of the avatar, leaning out of it
 */
@Component({
  selector: 'app-image',
  imports: [NgOptimizedImage],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
  host: { '[class.shrugging]': "pose() === 'shrugging'" },
})
export class ImageComponent extends GridItemDirective {
  /**
   * Pose of the avatar: arms crossed on the home page, shrugging next to the speech bubble of the
   * projects page
   */
  public readonly pose = input<AvatarPose>('arms-crossed');
}
