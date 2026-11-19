const _status = {
  completed: 'Terminé',
  abandoned: 'Abandonné',
  ongoing: 'En cours',
} as const;

export type Status = keyof typeof _status;
export type StatusValue = (typeof _status)[Status];

export const statuses = _status as Record<Status, StatusValue>;
export const statusesKeys = keys(statuses);

/**
 * Whether a value from the URL is a status
 * @param value query param value
 */
export function isStatus(value: string | null): value is Status {
  return statusesKeys.some(status => status === value);
}

//https://stackoverflow.com/a/70974124/13770966
//Record with string, because T can have non-string keys
function keys<T extends Record<string, unknown>>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}

export function getStatusKeyByValue(value: StatusValue): Status {
  return keys(statuses).find(key => statuses[key] === value) ?? 'abandoned'; //cannot return abandoned, just for typescript
}

export function getStatusValueByKey(status: Status): StatusValue {
  return statuses[status];
}
