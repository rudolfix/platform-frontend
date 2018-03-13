/**
 *  Formats date to dd-mm-yyyy format
 *
 * @param {number} timestamp
 * @returns {string}
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("de", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
