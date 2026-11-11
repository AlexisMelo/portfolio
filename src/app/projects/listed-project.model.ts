import { Tables } from 'database.types';

/**
 * Project as displayed and filtered on the projects page
 */
export interface ListedProject extends Pick<
  Tables<'project'>,
  'id' | 'label' | 'url' | 'description' | 'end_date' | 'abandoned'
> {
  /** Type of the project, searched by the text filter. */
  project_type: Pick<Tables<'project_type'>, 'label'>;

  /** Context of the project, used by the context and text filters. */
  project_context: Pick<Tables<'context'>, 'id' | 'label'>;

  /** Skills used in the project, the highlighted ones being displayed. */
  project_skills: Array<
    Pick<Tables<'project_skill'>, 'highlight'> & {
      skill: Pick<Tables<'skill'>, 'id' | 'label'>;
    }
  >;

  /** Illustrations, the one with the lowest position being displayed. */
  illustrations: Array<
    Pick<Tables<'project_illustration'>, 'url' | 'alt' | 'position'>
  >;

  /** Localized description resolved from the translations table. */
  localizedDescription: Pick<Tables<'translations'>, 'en' | 'fr'>;
}
