/**
 * Représente un projet
 */
export interface Project {
     /**
      * Identifiant unique
      */
     id: number;

     /**
      * Titre du projet
      */
     title: string;

     /**
      * Date de début du projet
      */
     date: number;

     /**
      * Type de projet
      */
     type: 'Site web' | 'Application bureautique';

     /**
      * Contexte du projet
      */
     company: string;

     /**
      * Description du projet
      */
     description: string;
}