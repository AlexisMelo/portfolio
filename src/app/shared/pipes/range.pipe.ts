import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range',
  standalone: true,
})
export class RangePipe implements PipeTransform {
  transform(size: number): number[] {
    return Array.from({ length: size }, (_, i) => i);
  }
}
