import { NgOptimizedImage } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { GridItemDirective } from '../../shared/grid/grid-item.directive';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';

@Component({
  selector: 'app-map',
  imports: [
    ActionButtonComponent,
    LeafletMapComponent,
    MatIconModule,
    NgOptimizedImage,
    TranslocoPipe,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent extends GridItemDirective {
  /**
   * Niveaux de zoom autorisés
   */
  private readonly allowedZoomLevels = [3, 6, 13];

  /**
   * Index of the displayed level in allowedZoomLevels
   */
  private readonly zoomIndex = signal(1);

  /**
   * Niveau de zoom de la map
   */
  protected readonly zoomLevel = computed(
    () => this.allowedZoomLevels[this.zoomIndex()]
  );

  /**
   * Is there a closer zoom level?
   */
  protected readonly canZoomIn = computed(
    () => this.zoomIndex() < this.allowedZoomLevels.length - 1
  );

  /**
   * Is there a wider zoom level?
   */
  protected readonly canZoomOut = computed(() => this.zoomIndex() > 0);

  /**
   * Has Leaflet displayed its first tiles? Until then, the static image stays on top of the map
   */
  protected readonly tilesLoaded = signal(false);

  /**
   * Zoom in button, absent at the closest level
   */
  private readonly zoomInButton =
    viewChild<ElementRef<HTMLButtonElement>>('zoomInButton');

  /**
   * Zoom out button, absent at the widest level
   */
  private readonly zoomOutButton =
    viewChild<ElementRef<HTMLButtonElement>>('zoomOutButton');

  /**
   * Injector for the render callback that follows a zoom
   */
  private readonly injector = inject(Injector);

  /**
   * Zoom sur la map
   */
  protected zoomIn() {
    this.zoomTo(this.zoomIndex() + 1);
  }

  /**
   * Dézoom sur la map
   */
  protected zoomOut() {
    this.zoomTo(this.zoomIndex() - 1);
  }

  /**
   * Changes the zoom level. The focus goes to the only button left when the pressed one disappears at the last level.
   */
  private zoomTo(index: number) {
    this.zoomIndex.set(index);

    if (!this.canZoomIn() || !this.canZoomOut()) {
      afterNextRender(
        () =>
          (this.zoomInButton() ?? this.zoomOutButton())?.nativeElement.focus(),
        { injector: this.injector }
      );
    }
  }

  /**
   * Ouvre google maps
   */
  public openMaps() {
    const win = window.open(
      'https://www.google.fr/maps/place/Caen,+France/',
      '_blank'
    );
    win?.focus();
  }
}
