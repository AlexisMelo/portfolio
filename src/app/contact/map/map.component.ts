import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { GridItemDirective } from '../grid-item.directive';
import { Subscription } from 'rxjs';
import { Theme } from 'src/app/shared/theme.model';
import { ActionButtonComponent } from '../action-button/action-button.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [ActionButtonComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent
  extends GridItemDirective
  implements AfterViewInit, OnDestroy
{
  private map?: L.Map;

  /**
   * Souscription aux changements de thème
   */
  private themeSubscription?: Subscription;

  /**
   * Niveaux de zoom autorisés
   */
  private allowedZoomLevels = [4, 6, 14];

  /**
   * Position de là où j'habite
   */
  private position: L.LatLngExpression = [49.183, -0.372];

  /**
   * Implémentation de AfterViewInit
   */
  ngAfterViewInit() {
    this.map = L.map('map', {
      center: this.position,
      zoom: this.maxZoom, //on commence au + zoomé
      attributionControl: false,
      scrollWheelZoom: false,
      zoomControl: false,
      dragging: false,
    });

    this.updateTile(this.themeService.theme.value);

    this.themeSubscription = this.themeService.theme.subscribe(theme =>
      this.updateTile(theme)
    );
  }

  /**
   * Zoom maximal
   */
  get maxZoom() {
    return this.allowedZoomLevels[this.allowedZoomLevels.length - 1];
  }

  /**
   * Zoom minimal
   */
  get minZoom() {
    return this.allowedZoomLevels[0];
  }

  /**
   * Zoom actuel
   */
  get zoom() {
    if (!this.map) return -1;

    return this.map.getZoom();
  }

  /**
   * Implémentation de OnDestroy
   */
  ngOnDestroy() {
    this.themeSubscription?.unsubscribe();
  }

  /**
   * Met à jour le fond de la carte
   *
   * https://leaflet-extras.github.io/leaflet-providers/preview/
   *
   * @param theme
   */
  private updateTile(theme: Theme) {
    if (!this.map) return;

    const tile =
      theme === 'dark-mode'
        ? L.tileLayer(
            'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg',
            {
              attribution:
                '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }
          )
        : L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          });

    tile.addTo(this.map);
  }

  /**
   * Dézoom sur la map
   */
  zoomOut() {
    if (!this.map) return;

    const levelIndex = this.allowedZoomLevels.indexOf(this.map.getZoom());
    if (levelIndex === -1 || levelIndex === 0) return;
    this.map.flyTo(this.position, this.allowedZoomLevels[levelIndex - 1]);
  }

  /**
   * Zoom sur la map
   */
  zoomIn() {
    if (!this.map) return;

    const levelIndex = this.allowedZoomLevels.indexOf(this.map.getZoom());
    if (levelIndex === -1 || levelIndex === this.allowedZoomLevels.length)
      return;
    this.map.flyTo(this.position, this.allowedZoomLevels[levelIndex + 1]);
  }
}
