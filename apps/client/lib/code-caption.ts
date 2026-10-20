export function readCodeCaption(meta: string | null | undefined): string | undefined {
  if (!meta) return undefined;
  const match = /\bcaption=(?:"([^"]*)"|'([^']*)')/.exec(meta);
  const caption = (match?.[1] ?? match?.[2] ?? '').trim();
  return caption || undefined;
}

export function fenceLanguage(className?: string): string {
  if (!className) return '';
  for (const name of className.split(/\s+/)) {
    if (name.startsWith('language-')) return name.slice('language-'.length);
    if (name.startsWith('lang-')) return name.slice('lang-'.length);
  }
  return '';
}
