import { Pipe, PipeTransform } from '@angular/core';
import { Skill } from '../projects/skill.model';

/**
 * Filtre une liste de skills pour n'en obtenir que les skills favoris
 */
@Pipe({
  name: 'loved',
  standalone: true,
})
export class LovedPipe implements PipeTransform {
  transform(skills: Array<Skill>): Array<Skill> {
    return skills.filter(s => s.loved);
  }
}
