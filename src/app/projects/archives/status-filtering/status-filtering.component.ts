import { Component, computed, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { Project } from '../../project.model';
import { Status } from '../../status/status.model';
import { StatusPipe } from '../../status/status.pipe';
import { ArchivesService } from '../archives.service';

@Component({
  selector: 'app-status-filtering',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './status-filtering.component.html',
  styleUrl: './status-filtering.component.scss',
  providers: [StatusPipe],
})
export class StatusFilteringComponent
  extends GridItemDirective
  implements OnInit
{
  /**
   * Handle data related to archives
   */
  public archivesService = inject(ArchivesService);

  /**
   * Get a status from a project
   */
  private statusPipe = inject(StatusPipe);

  /**
   * Handle routing
   */
  private router = inject(Router);

  /**
   * Handle routing
   */
  private route = inject(ActivatedRoute);

  /**
   * All projects grouped by status
   */
  public projectsByStatus = computed(() => {
    return this.archivesService.selectedProjects().reduce(
      (acc, project) => {
        const status = this.statusPipe.transform(project);
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(project);
        return acc;
      },
      {} as Record<Status, Project[]>
    );
  });

  /**
   * Should all status be displayed ?
   */
  public showAll = computed(() => {
    return this.archivesService.selectedStatus() === null;
  });

  /**
   * OnInit implementation
   */
  public ngOnInit() {
    this.route.queryParamMap.pipe(first()).subscribe(params => {
      const status = params.get('status');
      if (!status) return;
      this.archivesService.selectedStatus.set(status as Status);
    });
  }

  /**
   * Select a status
   * @param status
   */
  public selectStatus(status: Status) {
    if (this.archivesService.selectedStatus() === status) {
      this.clearStatus();
      return;
    }

    this.archivesService.selectedStatus.set(status);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        status: status,
      },
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Clear the selected status
   */
  public clearStatus() {
    this.archivesService.selectedStatus.set(null);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        status: null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
