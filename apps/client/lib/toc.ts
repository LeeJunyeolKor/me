import { toString } from 'mdast-util-to-string';
import { remark } from 'remark';
import { visit } from 'unist-util-visit';

import { uniqueSlug } from './slug';

export type TocItem = {
  id: string;
  title: string;
};

type Heading = {
  depth?: number;
  data?: { hProperties?: Record<string, string> };
};

export function applyHeadingIds(tree: Parameters<typeof visit>[0], toc: TocItem[]) {
  const seen = new Map<string, number>();
  visit(tree, 'heading', (node) => {
    const heading = node as Heading;
    if (heading.depth !== 2) return;
    const title = toString(node).trim();
    if (!title) return;
    const id = uniqueSlug(title, seen);
    toc.push({ id, title });
    const data = (heading.data ??= {});
    data.hProperties = { ...data.hProperties, id };
  });
}

export function remarkHeadingIds() {
  return (tree: Parameters<typeof visit>[0]) => {
    applyHeadingIds(tree, []);
  };
}

export function tableOfContents(markdown: string): TocItem[] {
  const tree = remark().parse(markdown);
  const toc: TocItem[] = [];
  applyHeadingIds(tree, toc);
  return toc;
}
