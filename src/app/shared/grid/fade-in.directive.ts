import {
  animate,
  AnimationBuilder,
  AnimationPlayer,
  style,
} from '@angular/animations';
import {
  Directive,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appFadeIn]',
  standalone: true,
})
export class FadeInDirective implements OnInit {
  /**
   * Handle animation
   */
  private animationBuilder = inject(AnimationBuilder);

  /**
   * Reference to the element
   */
  public elementRef = inject(ElementRef);

  /**
   * Manipulate the animation
   */
  private player?: AnimationPlayer;

  /**
   * Manipulate the render
   */
  private renderer = inject(Renderer2);

  /**
   * OnInit Implementation
   */
  ngOnInit() {
    const factory = this.animationBuilder.build(this.getSlideInAnimation());
    this.player = factory.create(this.elementRef.nativeElement);
    this.player.onDone(() => {
      this.player?.destroy(); //important, to delete the styles once the animation ends
    });
    this.player.play();
  }

  /**
   * Get Slide Animation
   */
  getSlideInAnimation() {
    return [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      animate('500ms', style({ opacity: 1, transform: 'translateY(0)' })),
    ];
  }
}
