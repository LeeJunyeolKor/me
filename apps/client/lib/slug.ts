function isSlugCharacter(character: string): boolean {
  if (character === ' ' || character === '-') return true;
  const code = character.codePointAt(0) ?? 0;
  return (
    (code >= 48 && code <= 57) ||
    (code >= 97 && code <= 122) ||
    (code >= 0x00c0 && code <= 0x024f) ||
    (code >= 0x1100 && code <= 0x11ff) ||
    (code >= 0x3130 && code <= 0x318f) ||
    (code >= 0xac00 && code <= 0xd7a3) ||
    (code >= 0x4e00 && code <= 0x9fff)
  );
}

export function uniqueSlug(title: string, seen: Map<string, number>): string {
  const base =
    Array.from(title.normalize('NFKC').trim().toLowerCase())
      .filter(isSlugCharacter)
      .join('')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'section';
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}
