import { Injectable } from '@angular/core';
import { Loading, LoadingState, Unloaded } from './loading-state.model';
import { Project } from 'src/app/projects/project.model';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  /**
   * Est-ce qu'on est entrain de charger un projet ?
   */
  public projectDetails: LoadingState<Project> = this.createUnloaded();

  /**
   * Factory pour créer un statut non-chargé
   * @returns
   */
  public createUnloaded(): Unloaded {
    return { state: 'unloaded' };
  }

  /**
   * Factory pour créer un statut entrain de charger
   * @returns
   */
  public createLoading(): Loading {
    return { state: 'loading' };
  }
}
