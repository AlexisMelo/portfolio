import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Project } from '../projects/project.model';
import { Context } from '../landing-page/timeline/context.model';
import { Skill } from '../projects/skill.model';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  /**
   * Client pour Supabase
   */
  private supabase: SupabaseClient;

  /**
   * Constructeur
   */
  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabasePublicKey
    );
  }

  /**
   * Obtient la liste de tous les projets
   * @returns
   */
  public async getProjects() {
    const { data, error } = await this.supabase
      .from('project')
      .select('*, project_type(*), context(*), skill(*)')
      .returns<Array<Project>>();
    return data ?? [];
  }

  /**
   * Obtient tous les expériences pros
   * @returns
   */
  public async getContexts() {
    const { data, error } = await this.supabase
      .from('context')
      .select('*, context_type(*), project(*)')
      .order('end_date', { ascending: false })
      .returns<Array<Context>>();
    return data ?? [];
  }

  /**
   * Obtient la liste de toutes les compétences
   * @returns
   */
  public async getSkills() {
    const { data, error } = await this.supabase
      .from('skill')
      .select('*')
      .returns<Array<Skill>>();
    return data ?? [];
  }
}
