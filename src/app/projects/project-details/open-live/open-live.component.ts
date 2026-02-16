import {
  Component,
  computed,
  HostBinding,
  HostListener,
  input,
} from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { Project } from '../../project.model';
import { StatusPipe } from '../../status/status.pipe';
import { MatIconModule } from '@angular/material/icon';
import { DotComponent } from 'src/app/shared/dot/dot.component';

@Component({
  selector: 'app-open-live',
  imports: [MatIconModule, DotComponent],
  templateUrl: './open-live.component.html',
  styleUrl: './open-live.component.scss',
  providers: [StatusPipe],
  host: {
    '[class.is-live]': 'isLive()',
  },
})
export class OpenLiveComponent extends GridItemDirective {
  /**
   * Project to display
   */
  public project = input.required<Project>();

  /**
   * Returns live url or null if project is unavailable
   */
  protected isLive = computed(() => {
    return this.project().deployment;
  });

  /**
   * Open project on click
   */
  @HostListener('click') onClick() {
    const url = this.isLive();
    if (!url) return;
    window.open(url, '_blank');
  }

  /**
   * Apply shadow based on link availability
   */
  @HostBinding('class.g-grid-item-shadow') get applyShadow() {
    return this.isLive();
  }
}
