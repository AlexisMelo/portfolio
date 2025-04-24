const _status = {
  completed: 'Terminé',
  abandoned: 'Abandonné',
  ongoing: 'En cours',
} as const;

export type Status = keyof typeof _status;
export type StatusValue = (typeof _status)[Status];

export const statuses = _status as Record<Status, StatusValue>;
export const statusesKeys = keys(statuses);

const _statusId = {
  completed: 0,
  abandoned: 1,
  ongoing: 2,
};

type IDs = (typeof _statusId)[Status];

export const statusesWithId = _statusId as Record<Status, IDs>;

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

export function getStatusIdByKey(status: Status): IDs {
  return statusesWithId[status];
}
