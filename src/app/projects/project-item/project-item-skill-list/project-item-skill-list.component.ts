import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tables } from 'database.types';
import { ARCHIVES_ROUTE } from 'src/app/app.routes';

@Component({
  selector: 'app-project-item-skill-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-item-skill-list.component.html',
  styleUrl: './project-item-skill-list.component.scss',
})
export class ProjectItemSkillListComponent {
  /**
   * Skills to display
   */
  @Input({ required: true }) skills: Array<Tables<'skill'>> = [];

  /**
   * Link to archives
   */
  public ARCHIVES_ROUTE = ARCHIVES_ROUTE;
}
