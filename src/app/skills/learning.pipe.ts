import { Pipe, PipeTransform } from '@angular/core';
import { Skill } from '../projects/skill.model';

/**
 * Filtre une liste de skills pour n'en obtenir que les skills en apprentissage
 */
@Pipe({
  name: 'learning',
  standalone: true,
})
export class LearningPipe implements PipeTransform {
  transform(skills: Array<Skill>): Array<Skill> {
    return skills.filter(s => s.currently_learning);
  }
}
