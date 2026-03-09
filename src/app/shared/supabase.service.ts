import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'database.types';
import { environment } from '../../environments/environment';
import { ContextWithProjects } from '../projects/context-with-projects.model';
import { ProjectItem } from '../projects/project-item/project-item.model';
import { Project } from '../projects/project.model';
import { Skill } from '../skills/skill.model';
import { Language } from './language.type';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  /**
   * Client pour Supabase
   */
  public client: SupabaseClient;

  /**
   * Translation service
   */
  private translocoService = inject(TranslocoService);

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
      .select(this.PROJECT_REQUEST);

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
      .select(
        '*, projects:project(*), localizedDescription:translations!description(*), localizedLabel:translations!label(*), localizedJob:translations!job(*)'
      )
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
      .select(
        '*, skill_type(*), projects:project(*), skill_field(*), localizedDescription:translations!description(*)'
      )
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
      .download('curriculum-vitae/CV.pdf');

    if (error || data === null)
      return Promise.reject('Erreur lors du téléchargement');
    return data;
  }

  /**
   * Returns "now" items translated in the currently active language.
   */
  public async getNowItems(): Promise<string[]> {
    const locale = this.translocoService.getActiveLang();
    const { data: infos, error: infosError } = await this.client
      .from('personal_infos')
      .select('label, value')
      .like('label', 'now%')
      .order('label');

    if (infosError) return Promise.reject(infosError);
    if (!infos?.length) return [];

    const translationKeys = infos.map(info => info.value);

    const { data: translations, error: translationsError } = await this.client
      .from('translations')
      .select('id, en, fr')
      .in('id', translationKeys);

    if (translationsError) return Promise.reject(translationsError);

    const col = locale as Language;
    return infos
      .map(info => translations?.find(t => t.id === info.value)?.[col] ?? null)
      .filter((text): text is string => text != null);
  }

  /**
   * Returns availability text (current situation and next date) in the active language.
   */
  public async getAvailabilityItems(locale: Language): Promise<{
    current: string;
    next: string;
  }> {
    const labels = ['availability_current', 'availability_next'];

    const { data: infos, error: infosError } = await this.client
      .from('personal_infos')
      .select('label, value')
      .in('label', labels);

    if (infosError) return Promise.reject(infosError);
    if (!infos?.length) return { current: '', next: '' };

    const translationKeys = infos.map(info => info.value);

    const { data, error: translationsError } = await this.client
      .from('translations')
      .select(`id, ${locale}`)
      .in('id', translationKeys);

    const translations = data as Array<
      { id: string } & Record<Language, string | null>
    > | null; //so the data is typed and does not throw an error later on

    if (translationsError || !translations)
      return Promise.reject(translationsError);

    const find = (label: string) => {
      const key = infos.find(i => i.label === label)?.value;
      return translations.find(t => t.id === key)?.[locale] ?? '';
    };

    return {
      current: find('availability_current'),
      next: find('availability_next'),
    };
  }

  /**
   * Count number of projects per skill
   * @param skillId
   * @returns
   */
  public async countProjectsBySkill(skillId: number) {
    const { count, error } = await this.client
      .from('project_skill')
      .select('*', { count: 'exact', head: true })
      .eq('skill_id', skillId);

    if (error || count === null)
      return Promise.reject('Error when getting project count');
    return count;
  }
}
