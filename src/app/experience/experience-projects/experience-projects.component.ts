import {
  Component,
  computed,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';
import { ContextWithProjects } from 'src/app/projects/context-with-projects.model';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { MosaiqueWebsitesComponent } from 'src/app/projects/mosaique-websites/mosaique-websites.component';

@Component({
  selector: 'app-experience-projects',
  standalone: true,
  imports: [MatIconModule, RouterLink, MosaiqueWebsitesComponent],
  templateUrl: './experience-projects.component.html',
  styleUrl: './experience-projects.component.scss',
  hostDirectives: [GridItemDirective],
})
export class ExperienceProjectsComponent {
  /**
   * Link to archives
   */
  public ARCHIVES_ROUTE = ARCHIVES_ROUTE;

  /**
   * Context to display
   */
  public context = input.required<ContextWithProjects>();

  /**
   * Handle routing
   */
  private router = inject(Router);

  /**
   * Number of projects
   */
  public projectsCount = computed(() => this.context().projects.length);

  @HostListener('click') onClick() {
    if (this.context().projects.length === 0) return;

    this.router.navigate([ARCHIVES_ROUTE], {
      queryParams: { contexts: this.context().id },
    });
  }
}
