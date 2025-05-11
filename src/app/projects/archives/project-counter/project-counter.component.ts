import { Component, inject } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { ArchivesService } from '../archives.service';

@Component({
  selector: 'app-project-counter',
  standalone: true,
  imports: [],
  templateUrl: './project-counter.component.html',
  styleUrl: './project-counter.component.scss',
})
export class ProjectCounterComponent extends GridItemDirective {
  /**
   * Handle data related to archives
   */
  public archivesService = inject(ArchivesService);
}
