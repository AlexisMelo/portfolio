import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Pipe({
  name: 'duration',
  pure: false,
})
export class DurationPipe implements PipeTransform {
  /**
   * Translation service
   */
  private translocoService = inject(TranslocoService);

  /**
   * Takes two dates and returns their difference in a readable, translated format.
   */
  transform(start_date: string | null, end_date: string | null): string | null {
    if (!start_date) return null;

    const today = new Date();
    const startDate = new Date(start_date);

    if (startDate > today) return null;

    const endDate = end_date ? new Date(end_date) : new Date();

    // Calcul des années
    let years = endDate.getFullYear() - startDate.getFullYear();

    // Calcul des mois
    let months = endDate.getMonth() - startDate.getMonth();

    // Calcul des jours
    const days = endDate.getDay() - startDate.getDay();

    // Ajustement si le mois de date2 est avant celui de date1
    if (months < 0) {
      years--;
      months += 12;
    }

    const t = (key: string, params?: object) =>
      this.translocoService.translate(key, params);

    const monthText = months > 0 ? t('duration.months', { count: months }) : '';
    const daysText = t('duration.days', { count: days <= 1 ? 1 : days });

    if (years > 0 && monthText) {
      return `${t('duration.yearsAbreviated', { count: years })}, ${monthText}`;
    } else if (years > 0) {
      return t('duration.years', { count: years });
    } else if (monthText) {
      return monthText;
    } else {
      return daysText;
    }
  }
}
