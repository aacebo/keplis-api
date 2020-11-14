export function parseName(name: string) {
  return name.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/[\s]/g, '-');
}
