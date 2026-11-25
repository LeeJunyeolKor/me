export const CATEGORIES = [
  { id: 'dev', label: '개발', description: '개발 노트와 만드는 과정에 대한 글입니다.' },
  { id: 'food', label: '맛집', description: '다녀온 식당과 먹은 메뉴를 기록합니다.' },
  { id: 'life', label: '일상', description: '일상에서 남기고 싶은 기록입니다.' },
] as const;

export type Category = (typeof CATEGORIES)[number]['id'];

export function isCategory(value: string): value is Category {
  return CATEGORIES.some((category) => category.id === value);
}

export function categoryLabel(category: Category): string {
  return CATEGORIES.find((item) => item.id === category)?.label ?? category;
}

export function categoryDescription(category: Category): string {
  return CATEGORIES.find((item) => item.id === category)?.description ?? '';
}

export function categoryIdFromParam(value: string): Category | '' {
  const trimmed = value.trim();
  if (isCategory(trimmed)) return trimmed;
  return CATEGORIES.find((category) => category.label === trimmed)?.id ?? '';
}

export function readCategory(value: unknown, filename: string): Category {
  if (value === undefined) return 'dev';
  if (typeof value !== 'string') {
    throw new Error(`Invalid post "${filename}": "category" must be dev, food, or life. Omit it to use dev.`);
  }
  const trimmed = value.trim();
  if (!isCategory(trimmed)) {
    throw new Error(`Invalid post "${filename}": "category" must be dev, food, or life. Omit it to use dev.`);
  }
  return trimmed;
}
