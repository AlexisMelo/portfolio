/**
 * Type de contexte
 */
export interface ContextType {
    /**
     * Identifiant unique
     */
    id: number;

    /**
     * Intitulé
     */
    label: 'Stage' | 'Emploi' | 'Perso' | 'École';
}