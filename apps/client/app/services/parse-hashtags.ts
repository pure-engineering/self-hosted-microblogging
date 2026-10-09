export function parseHashtags(input: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  input
    .split(/[\s,]+/)
    .map((raw) => raw.replace(/^#+/, ''))
    .forEach((tag) => {
      if (!tag) {
        return;
      }
      const key = tag.toLowerCase();
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      out.push(tag);
    });
  return out;
}

export default parseHashtags;
