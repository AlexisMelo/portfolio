export interface Loading {
  state: 'loading';
}

export interface Loaded<T> {
  state: 'loaded';
  data: T;
}

export interface Errored {
  state: 'error';
  error: Error;
}

export interface Unloaded {
  state: 'unloaded';
}

export type LoadingState<T> = Loading | Loaded<T> | Errored | Unloaded;
