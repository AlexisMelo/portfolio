import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import * as L from 'leaflet';
import { Theme } from 'src/app/shared/theme.model';
import { ThemeService } from 'src/app/shared/theme.service';

/**
 * The Leaflet map. Only used inside a @defer block, which puts Leaflet and its stylesheet in their own chunk.
 */
@Component({
  selector: 'app-leaflet-map',
  template: '',
  styleUrl: './leaflet-map.component.scss',
  // Leaflet creates its own DOM, which scoped styles wouldn't reach
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeafletMapComponent implements OnDestroy {
  /**
   * Zoom level to display
   */
  public readonly zoom = input.required<number>();

  /**
   * Emits when a new set of tiles is displayed
   */
  public readonly loaded = output<void>();

  /**
   * Zoom level of the first tiles, the one of the images in public/map
   */
  private readonly startZoom = 6;

  /**
   * Position de là où j'habite
   */
  private readonly position: L.LatLngExpression = [49.183, -0.372];

  /**
   * Current theme, which selects the tiles
   */
  private readonly theme = toSignal(inject(ThemeService).theme, {
    requireSync: true,
  });

  /**
   * Map instance, created once the host is in the DOM
   */
  private readonly map = signal<L.Map | undefined>(undefined);

  /**
   * Are the first tiles displayed? Zooming waits for them, so that the zoom animation is visible
   */
  private readonly tilesLoaded = signal(false);

  /**
   * Tile layer currently displayed
   */
  private tileLayer?: L.TileLayer;

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

    afterNextRender(() =>
      this.map.set(
        // The zoom buttons are the only way to move the map
        L.map(host, {
          center: this.position,
          zoom: this.startZoom,
          attributionControl: false,
          scrollWheelZoom: false,
          zoomControl: false,
          dragging: false,
          doubleClickZoom: false,
          touchZoom: false,
          boxZoom: false,
          keyboard: false,
        })
      )
    );

    effect(() => {
      const map = this.map();
      if (map) this.updateTile(map, this.theme());
    });

    effect(() => {
      const zoom = this.zoom();
      if (this.tilesLoaded() && this.map()?.getZoom() !== zoom) {
        this.map()?.flyTo(this.position, zoom, { duration: 1 });
      }
    });
  }

  /**
   * Implémentation de OnDestroy
   */
  ngOnDestroy() {
    this.map()?.remove();
  }

  /**
   * Met à jour le fond de la carte
   *
   * https://leaflet-extras.github.io/leaflet-providers/preview/
   *
   * @param map
   * @param theme
   */
  private updateTile(map: L.Map, theme: Theme) {
    const previousLayer = this.tileLayer;

    this.tileLayer = L.tileLayer(
      theme === 'dark-mode'
        ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom: 19 }
    );

    this.tileLayer.once('load', () => {
      previousLayer?.remove();
      this.tilesLoaded.set(true);
      this.loaded.emit();
    });

    this.tileLayer.addTo(map);
  }
}
