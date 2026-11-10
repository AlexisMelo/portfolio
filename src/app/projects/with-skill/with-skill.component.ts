import { Component, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ARCHIVES_ROUTE } from 'src/app/route-paths';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { SupabaseService } from 'src/app/shared/supabase.service';

@Component({
  selector: 'app-with-skill',
  imports: [TranslocoPipe],
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
