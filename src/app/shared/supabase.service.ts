import { Injectable } from '@angular/core';
import { PostgrestClient } from '@supabase/postgrest-js';
import { environment } from '../../environments/environment';
import { ContextWithProjects } from '../projects/context-with-projects.model';
import { ListedProject } from '../projects/listed-project.model';
import { Company } from '../home/companies/company.model';
import { ProjectCard } from '../home/projects-preview/project-card/project-card.model';
import { Recommendation } from '../home/recommendations/recommendation.model';
import { Project } from '../projects/project.model';
import { Skill } from '../skills/skill.model';
import { Language } from './language.type';

type Translation = { id: string } & Record<Language, string | null>; //so the data is typed and does not throw an error later on

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  /**
   * Client for the Supabase tables
   */
  public client: PostgrestClient;

  /**
   * Request to get a project with all its details
   */
  private readonly PROJECT_REQUEST = `*, localizedDescription:translations!description(*), localizedProblem:translations!problematic(*), localizedParticipation:translations!participation(*),
        roles:role(*), 
        illustrations:project_illustration(*),
        project_type(*),
        coworkers:project_coworker(
          *, 
          coworker(*)
        ), 
        project_context:context(*, localizedLabel:translations!label(*), localizedDescription:translations!description(*), localizedJob:translations!job(*)),
        project_skills:project_skill(
          *,
          skill(
            *,
            skill_type(*, localizedLabel:translations!label(*)),
            projects:project(id),
            skill_field(*)
          )
        )`;

  /**
   * Request to get only what the projects page displays and filters on
   */
  private readonly LISTED_PROJECT_REQUEST = `id, label, url, start_date, end_date, abandoned, pinned,
        localizedDescription:translations!description(en, fr),
        project_type(id, label),
        project_context:context(id, label),
        project_skills:project_skill(skill(id, label))`;

  /**
   * Constructeur
   */
  constructor() {
    const key = environment.supabasePublicKey;
    this.client = new PostgrestClient(`${environment.supabaseUrl}/rest/v1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
  }

  /**
   * Counts all projects, without downloading them
   * @returns
   */
  public async countProjects(): Promise<number> {
    const { count, error } = await this.client
      .from('project')
      .select('*', { count: 'exact', head: true });

    if (error || count === null)
      return Promise.reject('Error when getting project count');
    return count;
  }

  /**
   * Gets every project, with only the fields used by the projects page
   * @returns
   */
  public async getProjects(): Promise<Array<ListedProject>> {
    const { data, error } = await this.client
      .from('project')
      .select(this.LISTED_PROJECT_REQUEST)
      .overrideTypes<Array<ListedProject>, { merge: false }>();

    if (error) return Promise.reject(error);
    return data;
  }

  /**
   * Obtient la liste des projets épinglés, the most recent first (ongoing ones before the others)
   * @returns
   */
  public async getPinnedProjects(): Promise<Array<ProjectCard>> {
    const { data, error } = await this.client
      .from('project')
      .select(
        `id, label, url, end_date, icon,
        localizedDescription:translations!description(en, fr),
        illustrations:project_illustration(url, alt, position),
        project_context:context(localizedLabel:translations!label(en, fr))`
      )
      .eq('pinned', true)
      .order('end_date', { ascending: false, nullsFirst: true })
      .overrideTypes<Array<ProjectCard>, { merge: false }>();

    if (error) return Promise.reject(error);
    return data;
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
   * Companies I worked at (contexts flagged is_company), with the end date of each context, most
   * recent first
   * @param locale language of the names
   */
  public async getCompanies(locale: Language): Promise<Company[]> {
    const { data, error } = await this.client
      .from('context')
      .select(`end_date, localizedLabel:translations!label(${locale})`)
      .eq('is_company', true)
      .order('start_date', { ascending: false })
      .overrideTypes<
        Array<{
          end_date: string | null;
          localizedLabel: Partial<Record<Language, string | null>>;
        }>,
        { merge: false }
      >();

    if (error) return Promise.reject(error);
    return data.flatMap(company => {
      const name = company.localizedLabel[locale];
      return name ? [{ name, endDate: company.end_date }] : [];
    });
  }

  /**
   * Obtient la liste de toutes les compétences
   * @returns
   */
  public async getSkills(): Promise<Array<Skill>> {
    const { data, error } = await this.client
      .from('skill')
      .select(
        '*, skill_type(*, localizedLabel:translations!label(*)), projects:project(id), skill_field(*), localizedDescription:translations!description(*)'
      )
      .order('label');

    if (error) return Promise.reject(error);
    return data as Array<Skill>;
  }

  /**
   * Gets the LinkedIn recommendations, with their text in every language and their author, the
   * most recent first
   */
  public async getRecommendations(): Promise<Array<Recommendation>> {
    const { data, error } = await this.client
      .from('recommendations')
      .select(
        `id, link,
        localizedText:translations!text(en, fr),
        coworker(firstname, lastname, avatar_head)`
      )
      .order('date', { ascending: false, nullsFirst: false })
      .overrideTypes<Array<Recommendation>, { merge: false }>();

    if (error) return Promise.reject(error);
    return data;
  }

  /**
   * Returns the public URLs for the CV PDF and preview image for the given locale.
   * Reads `resume_pdf` and `resume_img` from `personal_infos`, then resolves the
   * locale-specific URL from the linked `translations` row.
   */
  public async getResumeLinks(
    locale: Language
  ): Promise<{ pdf: string; preview: string }> {
    const labels = ['resume_pdf', 'resume_img'];

    //get translations keys from personal infos
    const { data: personalInfos, error: infosError } = await this.client
      .from('personal_infos')
      .select('label, value')
      .in('label', labels);

    if (infosError) return Promise.reject(infosError);

    //get links according to locale
    const { data, error: translationsError } = await this.client
      .from('translations')
      .select(`id, ${locale}`)
      .in(
        'id',
        personalInfos.map(i => i.value)
      )
      .overrideTypes<Array<Translation>, { merge: false }>();

    if (translationsError || !data) return Promise.reject(translationsError);

    const find = (label: string) => {
      const key = personalInfos.find(i => i.label === label)?.value;
      return data.find(t => t.id === key)?.[locale] ?? '';
    };

    return { pdf: find('resume_pdf'), preview: find('resume_img') };
  }

  /**
   * Returns the public URL of a file in the bucket, which browsers and the CDN can cache
   * @param path path of the file in the bucket
   * @param downloadAs name to save the file under, instead of the browser displaying it
   */
  public getPublicUrl(path: string, downloadAs?: string): string {
    const url = encodeURI(
      `${environment.supabaseUrl}/storage/v1/object/public/portfolio-project/${path}`
    );
    return downloadAs
      ? `${url}?download=${encodeURIComponent(downloadAs)}`
      : url;
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

    const { data: translations, error: translationsError } = await this.client
      .from('translations')
      .select(`id, ${locale}`)
      .in('id', translationKeys)
      .overrideTypes<Array<Translation>, { merge: false }>();

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
}
