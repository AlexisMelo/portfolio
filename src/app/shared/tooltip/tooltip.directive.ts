import {
  ApplicationRef,
  ComponentRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  HostListener,
  inject,
  Input,
  ViewContainerRef,
  OnDestroy,
} from '@angular/core';
import { TooltipComponent } from './tooltip.component';
import { TooltipPosition } from './tooltip-position.model';

/**
 * https://accesto.com/blog/how-to-create-angular-tooltip-directive/
 */
@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  /**
   * Texte à afficher
   */
  @Input() tooltip = '';

  /**
   * Position du tooltip par rapport à l'élément
   */
  @Input() position: TooltipPosition = 'above';

  /**
   * Instance du tooltip en lui-même
   */
  private componentRef: ComponentRef<TooltipComponent> | null = null;

  /**
   * Composant sur lequel la directive est appliquée
   */
  private elementRef = inject(ElementRef);

  /**
   * Référence à l'application entière
   */
  private appRef = inject(ApplicationRef);

  /**
   * Gestion du factory des composants
   */
  private viewContainerRef = inject(ViewContainerRef);

  /**
   * Délais en ms avant d'afficher un tooltip
   */
  private showDelay = 300;

  /**
   * Timeout en cours pour l'affichage du tooltip
   */
  private showTimeout?: number;

  /**
   * Equivalent au Hover
   */
  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.initializeTooltip();
  }

  /**
   * Lorsque la souris quitte l'élément
   */
  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.destroy();
  }

  /**
   * Initialise le tooltip
   * @returns
   */
  private initializeTooltip() {
    if (!(this.componentRef === null)) return; //si le composant existe déjà, on ne l'ajoute pas de nouveau

    this.componentRef = this.viewContainerRef.createComponent(TooltipComponent);

    const domElem = (
      this.componentRef.hostView as EmbeddedViewRef<TooltipComponent>
    ).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem); //real dom
    this.setTooltipComponentProperties();
    this.showTimeout = window.setTimeout(
      () => this.showTooltip(),
      this.showDelay
    );
  }

  /**
   * Affiche le tooltip
   * @returns
   */
  private showTooltip() {
    if (this.componentRef === null) return;
    this.componentRef.instance.visibility = true;
  }

  /**
   * Configuration du tooltip
   */
  private setTooltipComponentProperties() {
    if (this.componentRef === null) return;

    this.componentRef.instance.tooltip = this.tooltip;
    this.componentRef.instance.position = this.position;

    const { left, right, top, bottom } =
      this.elementRef.nativeElement.getBoundingClientRect();

    switch (this.position) {
      case 'below': {
        this.componentRef.instance.left = Math.round((right - left) / 2 + left);
        this.componentRef.instance.top = Math.round(bottom);
        break;
      }
      case 'above': {
        this.componentRef.instance.left = Math.round((right - left) / 2 + left);
        this.componentRef.instance.top = Math.round(top);
        break;
      }
      case 'right': {
        this.componentRef.instance.left = Math.round(right);
        this.componentRef.instance.top = Math.round(top + (bottom - top) / 2);
        break;
      }
      case 'left': {
        this.componentRef.instance.left = Math.round(left);
        this.componentRef.instance.top = Math.round(top + (bottom - top) / 2);
        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * Implémentation de OnDestroy
   */
  ngOnDestroy(): void {
    this.destroy();
  }

  /**
   * Détruit le tooltip
   */
  destroy(): void {
    if (this.componentRef === null) return;

    window.clearTimeout(this.showTimeout);
    this.appRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();
    this.componentRef = null;
  }
}
