import { Project } from '../../projects/project.model';
import { ContextType } from './context-type.model';

/**
 * Contexte de travail (salariat, école, ...)
 */
export interface Context {
  /**
   * Identifiant unique
   */
  id: number;

  /**
   * Date de début
   */
  start_date: string;

  /**
   * Intitulé
   */
  label: string;

  /**
   * Détails du poste
   */
  description: string;

  /**
   * Lieu
   */
  localization: string;

  /**
   * Type d'objet
   */
  type: number;

  /**
   * Date de fin
   */
  end_date: string;

  /**
   * Type de context
   */
  context_type: ContextType;

  /**
   * Projets réalisés dans ce contexte
   */
  project: Array<Project>;

  /**
   * Logo
   */
  icon: string;
}
