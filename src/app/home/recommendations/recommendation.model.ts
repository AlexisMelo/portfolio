import { Tables } from 'database.types';

/**
 * A LinkedIn recommendation, as the recommendations tile displays it
 */
export interface Recommendation extends Pick<
  Tables<'recommendations'>,
  'id' | 'link'
> {
  /** Text of the recommendation, from the translations table */
  localizedText: Pick<Tables<'translations'>, 'en' | 'fr'> | null;

  /** Ex-colleague who wrote it */
  coworker: Pick<Tables<'coworker'>, 'firstname' | 'lastname' | 'avatar_head'>;
}
