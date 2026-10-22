/** "HH:mm" of `date` plus `offsetMin` minutes, in the browser's time zone. */
export function formatClock(date: Date, offsetMin = 0): string {
  const shifted = new Date(date.getTime() + offsetMin * 60_000);
  return `${String(shifted.getHours()).padStart(2, "0")}:${String(shifted.getMinutes()).padStart(2, "0")}`;
}
