import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Project } from './project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  /**
   * Client pour Supabase
   */
  private supabase: SupabaseClient

  /**
   * Constructeur
   */
  constructor() { 
    this.supabase = createClient(environment.supabaseUrl, environment.supabasePublicKey)
  }

  /**
   * Obtient la liste de tous les projets
   * @returns 
   */
  public async getProjects() {
    const { data, error } = await this.supabase.from('project').select().returns<Array<Project>>();
    return data ?? [];
  }
}
