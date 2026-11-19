/**
 * Year the earliest of some items (projects, contexts) started, null when none has a start date
 * @param items items to look at, with their start date as an ISO string
 */
export function firstStartYear(
  items: Array<{ start_date: string | null }>
): number | null {
  const dates = items
    .map(item => item.start_date)
    .filter(date => date !== null);
  if (dates.length === 0) return null;

  const first = dates.reduce((earliest, date) =>
    date < earliest ? date : earliest
  );
  return Number(first.slice(0, 4));
}
