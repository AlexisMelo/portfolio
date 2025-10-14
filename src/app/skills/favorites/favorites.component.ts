import { Component, inject, signal } from '@angular/core';
import { SupabaseService } from 'src/app/shared/supabase.service';
import { Skill } from '../skill.model';
import { LovedPipe } from '../loved.pipe';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
  providers: [LovedPipe],
  hostDirectives: [GridItemDirective],
})
export class FavoritesComponent {
  /**
   * Handle database data
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Skills to display
   */
  public skills = signal<Array<Skill>>([]);

  /**
   * Filter skills based on loved ones
   */
  private lovedPipe = inject(LovedPipe);

  /**
   * Constructor
   */
  constructor() {
    this.supabaseService
      .getSkills()
      .then(skills => this.skills.set(this.lovedPipe.transform(skills)));
  }
}
