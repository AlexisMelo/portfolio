import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'database.types';
import { environment } from '../../environments/environment';
import { Context } from '../landing-page/timeline/context.model';
import { ProjectItem } from '../projects/project-item/project-item.model';
import { Project } from '../projects/project.model';
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
    this.supabase = createClient<Database>(
      environment.supabaseUrl,
      environment.supabasePublicKey
    );
  }

  /**
   * Obtient la liste de tous les projets
   * @returns
   */
  public async getProjects(): Promise<Array<Project>> {
    const { data, error } = await this.supabase
      .from('project')
      .select(
        '*, roles:role(*), illustrations:project_illustration(*), project_type(*), sections:section(*), coworkers:project_coworker(*, coworker(*)), project_context:context(*), skills:skill(*, skill_type(*), projects:project(*), skill_field(*))'
      )
      .order('end_date', { ascending: false })
      .order('main', { referencedTable: 'skill', ascending: false });

    if (error) return Promise.reject(error);
    return data as Array<Project>;
  }

  /**
   * Obtient la liste des projets épinglés
   * @returns
   */
  public async getPinnedProjects(): Promise<Array<ProjectItem>> {
    const { data, error } = await this.supabase
      .from('project')
      .select('*, illustrations:project_illustration(*)')
      .eq('pinned', true);

    if (error) return Promise.reject(error);
    return data as Array<Project>;
  }

  /**
   * Obtient un projet à partir de son URL unique
   * @param url
   */
  public async getProjectByUrl(url: string): Promise<Project> {
    const { data, error } = await this.supabase
      .from('project')
      .select(
        '*, roles:role(*), illustrations:project_illustration(*), project_type(*), sections:section(*), coworkers:project_coworker(*, coworker(*)), project_context:context(*), skills:skill(*, skill_type(*), projects:project(*), skill_field(*))'
      )
      .eq('url', url)
      .order('main', { referencedTable: 'skill', ascending: false })
      .order('label', { referencedTable: 'skill' })
      .limit(1)
      .single<Project>();

    if (error) return Promise.reject(error);
    return data as Project;
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
  public async getSkills(): Promise<Array<Skill>> {
    const { data, error } = await this.supabase
      .from('skill')
      .select('*, skill_type(*), projects:project(*), skill_field(*)')
      .order('label');

    if (error) return Promise.reject(error);
    return data as Array<Skill>;
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

  /**
   * Obtient la liste des clients pour la page d'accueil
   * @returns
   */
  public async getLandingClients() {
    const { data } = await this.supabase
      .from('context')
      .select('*')
      .eq('show_landing', true)
      .returns<Array<Context>>();
    return data ?? [];
  }

  /**
   * Télécharge mon CV
   * @returns
   */
  public async getResume(): Promise<Blob> {
    const { data, error } = await this.supabase.storage
      .from('portfolio-project')
      .download('CV.pdf');

    if (error || data === null)
      return Promise.reject('Erreur lors du téléchargement');
    return data;
  }
}
