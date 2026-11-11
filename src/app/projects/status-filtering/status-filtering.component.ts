import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { ListedProject } from '../listed-project.model';
import { ProjectsService } from '../projects.service';
import { Status } from '../status/status.model';
import { StatusPipe } from '../status/status.pipe';

@Component({
  selector: 'app-status-filtering',
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
   * Projects, filters and their results
   */
  public projectsService = inject(ProjectsService);

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
   * Stops following the URL when the page is left
   */
  private destroyRef = inject(DestroyRef);

  /**
   * All projects grouped by status
   */
  public projectsByStatus = computed(() => {
    return this.projectsService.selectedProjects().reduce(
      (acc, project) => {
        const status = this.statusPipe.transform(project);
        if (!acc[status]) {
          acc[status] = [];
        }
        acc[status].push(project);
        return acc;
      },
      {} as Record<Status, ListedProject[]>
    );
  });

  /**
   * Should all status be displayed ?
   */
  public showAll = computed(() => {
    return this.projectsService.selectedStatus() === null;
  });

  /**
   * Follows the status in the URL, which also changes while the page is displayed:
   * the "ongoing" tile, and the browser's back and forward buttons
   */
  public ngOnInit() {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params =>
        this.projectsService.selectedStatus.set(
          params.get('status') as Status | null
        )
      );
  }

  /**
   * Select a status
   * @param status
   */
  public selectStatus(status: Status) {
    if (this.projectsService.selectedStatus() === status) {
      this.clearStatus();
      return;
    }

    this.projectsService.selectedStatus.set(status);

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
    this.projectsService.selectedStatus.set(null);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        status: null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
