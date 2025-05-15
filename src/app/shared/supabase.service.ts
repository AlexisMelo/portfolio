import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'database.types';
import { environment } from '../../environments/environment';
import { ProjectItem } from '../projects/project-item/project-item.model';
import { Project } from '../projects/project.model';
import { Skill } from '../skills/skill.model';
import { ContextWithProjects } from '../projects/projects-by-context/context-with-projects.model';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  /**
   * Client pour Supabase
   */
  public client: SupabaseClient;

  /**
   * Request to get a project with all its details
   */
  private readonly PROJECT_REQUEST = `*,
        roles:role(*), 
        illustrations:project_illustration(*),
        project_type(*),
        coworkers:project_coworker(
          *, 
          coworker(*)
        ), 
        project_context:context(*), 
        project_skills:project_skill(
          *,
          skill(
            *,
            skill_type(*), 
            projects:project(*),
            skill_field(*)
          )
        )`;

  /**
   * Constructeur
   */
  constructor() {
    this.client = createClient<Database>(
      environment.supabaseUrl,
      environment.supabasePublicKey
    );
  }

  /**
   * Obtient le nombre de projets en cours
   * @returns
   */
  public async countOngoingProjects(): Promise<number> {
    const { data, error } = await this.client
      .from('project')
      .select('*')
      .is('end_date', null)
      .is('abandoned', false);

    if (error) return Promise.reject(error);
    return data.length as number;
  }

  /**
   * Obtient la liste de tous les projets
   * @returns
   */
  public async getProjects(): Promise<Array<Project>> {
    const { data, error } = await this.client
      .from('project')
      .select(this.PROJECT_REQUEST)
      .order('end_date', { ascending: false });

    if (error) return Promise.reject(error);
    return data as Array<Project>;
  }

  /**
   * Obtient la liste des projets épinglés
   * @returns
   */
  public async getPinnedProjects(): Promise<Array<ProjectItem>> {
    const { data, error } = await this.client
      .from('project')
      .select(
        '*, illustrations:project_illustration(*), project_skills:project_skill(*, skill:skill(*))'
      )
      .eq('pinned', true);

    if (error) return Promise.reject(error);
    return data as Array<ProjectItem>;
  }

  /**
   * Obtient un projet à partir de son URL unique
   * @param url
   */
  public async getProjectByUrl(url: string): Promise<Project> {
    const { data, error } = await this.client
      .from('project')
      .select(this.PROJECT_REQUEST)
      .eq('url', url)
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
    const { data } = await this.client
      .from('context')
      .select('*, context_type(*), projects:project(*)')
      .order('end_date', { ascending: false })
      .order('start_date', { ascending: false })
      .returns<Array<ContextWithProjects>>();

    return data ?? [];
  }

  /**
   * Obtient la liste de toutes les compétences
   * @returns
   */
  public async getSkills(): Promise<Array<Skill>> {
    const { data, error } = await this.client
      .from('skill')
      .select('*, skill_type(*), projects:project(*), skill_field(*)')
      .order('label');

    if (error) return Promise.reject(error);
    return data as Array<Skill>;
  }

  /**
   * Télécharge mon CV
   * @returns
   */
  public async getResume(): Promise<Blob> {
    const { data, error } = await this.client.storage
      .from('portfolio-project')
      .download('CV.pdf');

    if (error || data === null)
      return Promise.reject('Erreur lors du téléchargement');
    return data;
  }
}
