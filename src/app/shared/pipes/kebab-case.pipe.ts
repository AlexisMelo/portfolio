import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforme une chaine de caractère en kebabcase
 */
@Pipe({
  name: 'kebabCase',
  standalone: true,
})
export class KebabCasePipe implements PipeTransform {
  transform(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') //https://www.30secondsofcode.org/js/s/remove-accents/
      .replace(/ /g, '-');
  }
}
