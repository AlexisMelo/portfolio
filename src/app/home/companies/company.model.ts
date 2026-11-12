/**
 * A company I worked at, as the companies tile displays it
 */
export interface Company {
  /** Name in the active language */
  name: string;

  /** End date of the context (ISO date), null while it lasts */
  endDate: string | null;
}
