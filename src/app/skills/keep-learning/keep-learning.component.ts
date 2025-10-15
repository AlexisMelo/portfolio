import { Component, inject, signal } from '@angular/core';
import { GridItemDirective } from 'src/app/shared/grid/grid-item.directive';
import { Skill } from '../skill.model';
import { LearningPipe } from '../learning.pipe';
import { SupabaseService } from 'src/app/shared/supabase.service';

@Component({
  selector: 'app-keep-learning',
  standalone: true,
  imports: [],
  templateUrl: './keep-learning.component.html',
  styleUrl: './keep-learning.component.scss',
  hostDirectives: [GridItemDirective],
  providers: [LearningPipe],
})
export class KeepLearningComponent {
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
  private learningPipe = inject(LearningPipe);

  /**
   * Constructor
   */
  constructor() {
    this.supabaseService
      .getSkills()
      .then(skills => this.skills.set(this.learningPipe.transform(skills)));
  }
}
