/**
 * Expérience
 */
export interface TimelineItem {
    /**
     * Identifiant unique
     */
    id: number;

    /**
     * Date de début
     */
    date: number;
    
    /**
     * Intitulé du travail
     */
    job: string;

    /**
     * Entreprise
     */
    company: string;

    /**
     * Lieu
     */
    localisation: string;

    /**
     * Type d'objet
     */
    type: 'Job' | 'School'
}