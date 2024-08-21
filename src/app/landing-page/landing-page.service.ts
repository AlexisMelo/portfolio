import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { TimelineItem } from './timeline/timeline-item.model';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {
  /**
   * Client for requesting Supabase
   */
  private supabase: SupabaseClient

  /**
   * Constructor
   */
  constructor() { 
    this.supabase = createClient(environment.supabaseUrl, environment.supabasePublicKey)
  }

  /**
   * Obtient tous les expériences pros
   * @returns 
   */
  public async getExperiences() {
    const { data, error } = await this.supabase.from('context').select().order('date_debut', {ascending: false}).returns<Array<TimelineItem>>();
    return data ?? [];
  }
}
