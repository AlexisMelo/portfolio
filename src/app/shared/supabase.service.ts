import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Project } from '../projects/project.model';
import { Context } from '../landing-page/timeline/context.model';

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
    const { data } = await this.supabase
      .from('project')
      .select('*, project_type(*), context(*), skill(*)')
      .order('end_date', { ascending: false })
      .order('main', { referencedTable: 'skill', ascending: false })
      .returns<Array<Project>>();
    return data ?? [];
  }

  /**
   * Obtient un projet à partir de son URL unique
   * @param url
   */
  public async getProjectByUrl(url: string) {
    const { data } = await this.supabase
      .from('project')
      .select(
        '*, project_type(*), context(*), skill(*, skill_type(*)), coworker(*), role(*), section(*)'
      )
      .eq('url', url)
      .order('main', { referencedTable: 'skill', ascending: false })
      .order('label', { referencedTable: 'skill' })
      .returns<Project>()
      .limit(1)
      .single<Project>()
      .throwOnError();
    return data;
  }

  /**
   * Obtient tous les expériences pros
   * @returns
   */
  public async getContexts() {
    const { data } = await this.supabase
      .from('context')
      .select('*, context_type(*), project(*)')
      .order('end_date', { ascending: false })
      .order('start_date', { ascending: false })
      .returns<Array<Context>>();
    return data ?? [];
  }

  /**
   * Obtient la liste de toutes les compétences
   * @returns
   */
  public async getSkills() {
    const { data } = await this.supabase
      .from('skill')
      .select('*, skill_type(*)')
      .order('label');
    return data ?? [];
  }

  /**
   * Obtient la liste des sections à afficher sur la page d'accueil
   * @returns
   */
  public async getLandingSections() {
    const { data } = await this.supabase
      .from('section')
      .select('*')
      .like('tags', '%landing%')
      .order('position');
    return data ?? [];
  }
}
