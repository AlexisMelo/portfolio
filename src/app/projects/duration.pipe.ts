import { Pipe, PipeTransform } from '@angular/core';
import { Project } from './project.model';

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  /**
   * Prend deux dates et retourne la différence dans un format lisible
   * @returns
   */
  transform(project: Project | undefined): string {
    if (!project) return '-';

    const endDate = new Date(project.start_date);
    const startDate = project.end_date
      ? new Date(project.end_date)
      : new Date();

    // Calcul des années
    let years = startDate.getFullYear() - endDate.getFullYear();
    // Calcul des mois
    let months = startDate.getMonth() - endDate.getMonth();

    // Ajustement si le mois de date2 est avant celui de date1
    if (months < 0) {
      years--;
      months += 12;
    }

    // Construction des parties de la chaîne
    const yearText = years > 0 ? (years === 1 ? '1 an' : `${years} ans`) : '';
    const monthText =
      months > 0 ? (months === 1 ? '1 mois' : `${months} mois`) : '';

    // Combiner les résultats
    if (yearText && monthText) {
      return `${yearText} et ${monthText}`;
    } else if (yearText) {
      return yearText;
    } else if (monthText) {
      return monthText;
    } else {
      return "Moins d'un mois"; // Si aucune différence notable
    }
  }
}
