/**
 * Labels of the `personal_infos` rows shown on the legal page. A row's value is either the text
 * itself or the id of a `translations` row, for the texts written in both languages.
 */
export const LEGAL_INFO_LABELS = [
  'legal_name',
  'legal_address',
  'legal_siret',
  'legal_vat',
  'legal_host_name',
  'legal_host_address',
  'legal_host_website',
  'legal_updated',
] as const;

/**
 * Label of a `personal_infos` row shown on the legal page
 */
export type LegalInfoLabel = (typeof LEGAL_INFO_LABELS)[number];

/**
 * Information of the legal page, in the current language; a row missing from the database is
 * left out
 */
export type LegalInfos = Partial<Record<LegalInfoLabel, string>>;
