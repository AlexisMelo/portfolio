import { Directive } from '@angular/core';

/**
 * Fades the host in when it enters the DOM (.g-fade-in in styles.scss)
 */
@Directive({
  selector: '[appFadeIn]',
  standalone: true,
  host: {
    'animate.enter': 'g-fade-in',
  },
})
export class FadeInDirective {}
