import { Component } from '@angular/core';
import { Context } from './context.model';
import { TimelineItemRightComponent } from './timeline-item-right/timeline-item-right.component';
import { TimelineItemLeftComponent } from './timeline-item-left/timeline-item-left.component';
import { SupabaseService } from '../../shared/supabase.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [TimelineItemRightComponent, TimelineItemLeftComponent],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent {
  /**
   * Liste de tous les objets à afficher
   */
  private items: Array<Context> = [];

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
      this.items = experiences});
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
