import { Component, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { MosaiqueWebsitesComponent } from '../mosaique-websites/mosaique-websites.component';

@Component({
  selector: 'app-with-skill',
  standalone: true,
  imports: [MosaiqueWebsitesComponent],
  templateUrl: './with-skill.component.html',
  styleUrl: './with-skill.component.scss',
})
export class WithSkillComponent extends GridItemDirective {
  /**
   * Handle routing
   */
  private router = inject(Router);

  /**
   * Handle clicking on component
   */
  @HostListener('click') onClick() {
    this.router.navigate([ARCHIVES_ROUTE], { queryParams: { skills: 2 } });
  }
}
