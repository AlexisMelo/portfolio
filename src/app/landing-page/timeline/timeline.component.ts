import { Component, OnInit } from '@angular/core';
import { ContextWithProjects } from './context-with-projects.model';
import { TimelineItemRightComponent } from './timeline-item-right/timeline-item-right.component';
import { TimelineItemLeftComponent } from './timeline-item-left/timeline-item-left.component';
import { SupabaseService } from '../../shared/supabase.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [TimelineItemRightComponent, TimelineItemLeftComponent],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent implements OnInit {
  /**
   * Liste de tous les objets à afficher
   */
  private items: Array<ContextWithProjects> = [];

  /**
   * Constructeur
   * @param supabaseService
   */
  constructor(private supabaseService: SupabaseService) {}

  /**
   * Implémentation de OnInit
   */
  ngOnInit() {
    this.supabaseService.getContexts().then(experiences => {
      this.items = experiences.filter(e => e.context_type.id !== 3); //On enlève les projets persos intemporels
    });
  }

  /**
   * Items à afficher, sans le dernier
   */
  get timelineItems() {
    return this.items.slice(0, -1);
  }

  /**
   * Dernier item à afficher
   */
  get lastItem() {
    return this.items.slice(-1)[0];
  }
}
