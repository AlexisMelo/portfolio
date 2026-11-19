import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  signal,
  viewChildren,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { PROJECTS_ROUTE } from 'src/app/route-paths';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { LoaderComponent } from 'src/app/shared/loader/loader.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { ProjectCard } from './project-card/project-card.model';

/**
 * Number of projects the selector has room for: its fourth cell links to every project
 */
const MAX_PROJECTS = 3;

/**
 * Time a project stays displayed before the next one replaces it, in milliseconds
 */
const ROTATION_DELAY = 3000;

/**
 * Timing of the slide between two projects: the next one comes in from the selector, on the right,
 * while the displayed one goes out to the left
 */
const SLIDE: KeyframeAnimationOptions = {
  duration: 700,
  easing: 'cubic-bezier(0.3, 0, 0, 1)',
};

/**
 * Number given to the next preview, so that each one has its own element ids
 */
let nextPreviewId = 0;

/**
 * Tile showing one of the highlighted projects at a time as a project card, in a box with a label
 * on its top left and, on its right, tabs like the dividers of a notebook: one per project, then a
 * link to every project. The tabs follow the ARIA tabs pattern.
 *
 * The projects take turns every few seconds, from the one displayed. The rotation pauses while the
 * mouse is over the tile, and while the keyboard focus is in it, so that a project does not change
 * under a keyboard or screen reader user (WCAG 2.2.2).
 */
@Component({
  selector: 'app-projects-preview',
  imports: [
    LoaderComponent,
    MatIconModule,
    NgOptimizedImage,
    ProjectCardComponent,
    RouterLink,
    TranslocoPipe,
  ],
  templateUrl: './projects-preview.component.html',
  styleUrl: './projects-preview.component.scss',
  host: {
    '(mouseenter)': 'pointerInside.set(true)',
    '(mouseleave)': 'pointerInside.set(false)',
    '(focusin)': 'onFocusIn($event)',
    '(focusout)': 'keyboardFocusInside.set(false)',
  },
})
export class ProjectsPreviewComponent extends GridItemDirective {
  /**
   * Highlighted projects, empty until they are loaded: the tile shows a loader meanwhile
   */
  public readonly projects = input.required<Array<ProjectCard>>();

  /**
   * Path of the projects page
   */
  protected readonly PROJECTS_ROUTE = PROJECTS_ROUTE;

  /**
   * Index of the displayed project in the selector
   */
  protected readonly selectedIndex = signal(0);

  /**
   * Projects the selector offers
   */
  protected readonly selectable = computed(() =>
    this.projects().slice(0, MAX_PROJECTS)
  );

  /**
   * Whether the mouse is over the tile, which pauses the rotation
   */
  protected readonly pointerInside = signal(false);

  /**
   * Whether the keyboard focus is in the tile, which pauses the rotation. A mouse click, which
   * focuses without showing it, does not count: only the mouse being over the tile pauses then.
   */
  protected readonly keyboardFocusInside = signal(false);

  /**
   * Number of projects the selector offers
   */
  private readonly count = computed(() => this.selectable().length);

  /**
   * Prefix of the ids of the tabs and panels, which link them to each other
   */
  private readonly idPrefix = `projects-preview-${nextPreviewId++}`;

  /**
   * Id of the label on the top left of the tile, which names the tab list
   */
  protected readonly labelId = `${this.idPrefix}-label`;

  /**
   * Tabs of the selector, to move the focus with the arrow keys
   */
  private readonly tabs = viewChildren<ElementRef<HTMLButtonElement>>('tab');

  /**
   * Panels of the projects, to slide them when the displayed project changes
   */
  private readonly panels = viewChildren<ElementRef<HTMLElement>>('panel');

  /**
   * Shows the next project every few seconds while the rotation runs. A pause restarts the delay.
   */
  constructor() {
    super();
    effect(onCleanup => {
      const count = this.count();
      if (count < 2 || this.pointerInside() || this.keyboardFocusInside())
        return;

      const timer = setInterval(
        () => this.select((this.selectedIndex() + 1) % count),
        ROTATION_DELAY
      );
      onCleanup(() => clearInterval(timer));
    });
  }

  /**
   * Id of the tab of a project
   * @param index index of the project in the selector
   */
  protected tabId(index: number): string {
    return `${this.idPrefix}-tab-${index}`;
  }

  /**
   * Id of the panel showing a project
   * @param index index of the project in the selector
   */
  protected panelId(index: number): string {
    return `${this.idPrefix}-panel-${index}`;
  }

  /**
   * Displays a project, the one the visitor picked or the next one of the rotation, which goes on
   * from it
   * @param index index of the project in the selector
   */
  protected select(index: number): void {
    const previous = this.selectedIndex();
    if (index === previous) return;

    this.selectedIndex.set(index);
    this.slide(previous, index);
  }

  /**
   * Pauses the rotation when the focus comes in from the keyboard
   */
  protected onFocusIn(event: FocusEvent): void {
    this.keyboardFocusInside.set(
      (event.target as Element).matches(':focus-visible')
    );
  }

  /**
   * Moves to the previous or next tab with the up and down arrows (looping), to the first one
   * with Home and to the last one with End, displaying its project
   */
  protected onTabKeydown(event: KeyboardEvent): void {
    const count = this.count();
    const index = this.selectedIndex();
    const targets: Record<string, number> = {
      ArrowUp: (index - 1 + count) % count,
      ArrowDown: (index + 1) % count,
      Home: 0,
      End: count - 1,
    };
    const target = targets[event.key];
    if (target === undefined) return;

    event.preventDefault();
    this.select(target);
    this.tabs()[target]?.nativeElement.focus();
  }

  /**
   * Slides the project leaving out to the left, from where it is (even halfway in when the visitor
   * switches quickly), while the next one always comes in from the right. Both stay visible during
   * the slide. Nothing moves when the visitor asks for reduced motion.
   * @param from index of the project leaving
   * @param to index of the project coming in
   */
  private slide(from: number, to: number): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const leaving = this.panels()[from]?.nativeElement;
    const entering = this.panels()[to]?.nativeElement;
    if (!leaving || !entering) return;

    const position = getComputedStyle(leaving).transform;
    leaving.getAnimations().forEach(animation => animation.cancel());
    leaving.animate(
      [
        { transform: position, visibility: 'visible' },
        { transform: 'translateX(-100%)', visibility: 'visible' },
      ],
      SLIDE
    );

    entering.getAnimations().forEach(animation => animation.cancel());
    entering.animate(
      [
        { transform: 'translateX(100%)', visibility: 'visible' },
        { transform: 'none', visibility: 'visible' },
      ],
      SLIDE
    );
  }
}
