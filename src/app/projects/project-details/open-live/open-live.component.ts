import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { DotComponent } from 'src/app/shared/dot/dot.component';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { Project } from '../../project.model';

/**
 * Coral tile opening the deployed project in a new tab, or saying it is private when it is not
 * online
 */
@Component({
  selector: 'app-open-live',
  imports: [MatIconModule, DotComponent, TranslocoPipe],
  templateUrl: './open-live.component.html',
  styleUrl: './open-live.component.scss',
  host: { class: 'g-grid-item-highlight' },
})
export class OpenLiveComponent extends GridItemDirective {
  /**
   * Project to display
   */
  public project = input.required<Project>();

  /**
   * Address of the deployed project, null when it is not online
   */
  protected url = computed(() => this.project().deployment);
}
