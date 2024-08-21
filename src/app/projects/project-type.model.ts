import { Context } from "../landing-page/timeline/context.model";

/**
 * Type de projet
 */
export interface ProjectType {
     /**
      * Identifiant unique
      */
     id: number;

     /**
      * Titre du projet
      */
     label: 'Site web' | 'Application bureau';
}