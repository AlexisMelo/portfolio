import { Component, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { SupabaseService } from 'src/app/shared/supabase.service';
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

  /**
   * Handle database requests
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Count of projects
   */
  protected count = signal(0);

  /**
   * Constructor
   */
  constructor() {
    super();
    this.supabaseService
      .countProjectsBySkill(2)
      .then(count => this.count.set(count));
  }
}
