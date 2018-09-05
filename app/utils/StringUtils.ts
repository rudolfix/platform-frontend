export function extractNumber(s?: string): string {
  if (!s) return "";
  return s.replace(/([^\.\d])/g, "");
}
