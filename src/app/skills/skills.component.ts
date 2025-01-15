import { Component, inject, OnInit } from '@angular/core';
import { TitleSeparatorComponent } from '../shared/title-separator/title-separator.component';
import { RowWithSeparatorComponent } from '../shared/row-with-separator/row-with-separator.component';
import { SupabaseService } from '../shared/supabase.service';
import { Skill } from '../projects/skill.model';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [TitleSeparatorComponent, RowWithSeparatorComponent],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements OnInit {
  /**
   * Accès à la base de données
   */
  private supabaseService = inject(SupabaseService);

  /**
   * Liste des skills
   */
  public skills?: Array<Skill>;

  /**
   * Implémentation de OnInit
   */
  ngOnInit() {
    this.supabaseService.getSkills().then(skills => (this.skills = skills));
  }
}
