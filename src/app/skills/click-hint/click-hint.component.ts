import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { Skill } from '../skill.model';
import { RouterLink } from '@angular/router';

/**
 * Longest skill name that fits on a folder without being cut, in characters, once written smaller
 */
const MAX_LABEL_LENGTH = 11;

/**
 * Longest skill name written at the full size on a folder, in characters
 */
const MAX_FULL_SIZE_LENGTH = 8;

/**
 * Tile of the skills page inviting visitors to click a skill
 */
@Component({
  selector: 'app-click-hint',
  imports: [TranslocoPipe, RouterLink],
  templateUrl: './click-hint.component.html',
  styleUrl: './click-hint.component.scss',
  hostDirectives: [GridItemDirective],
})
export class ClickHintComponent {
  /**
   * Every skill, undefined until they are loaded
   */
  public readonly skills = input<Array<Skill> | undefined>();

  /**
   * Labels of the three folders that rise, from the back one to the front one: three different
   * skills picked at random when the skills arrive, empty until then. Only names that fit on a
   * folder are picked, unless too few do.
   */
  protected readonly folderLabels = computed(() => {
    const skills = this.skills() ?? [];
    const short = skills.filter(s => s.label.length <= MAX_LABEL_LENGTH);
    const pool = [...(short.length >= 3 ? short : skills)];
    const labels: Array<string> = [];

    while (labels.length < 3 && pool.length > 0) {
      const [skill] = pool.splice(Math.floor(Math.random() * pool.length), 1);
      labels.push(skill.label);
    }

    return [0, 1, 2].map(i => labels[i] ?? '');
  });

  /**
   * Whether a folder label is long enough to be written smaller
   */
  protected isLong(label: string): boolean {
    return label.length > MAX_FULL_SIZE_LENGTH;
  }
}
