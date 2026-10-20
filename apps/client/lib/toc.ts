import { toString } from 'mdast-util-to-string';
import { remark } from 'remark';
import { visit } from 'unist-util-visit';

import { uniqueSlug } from './slug';

export type TocItem = {
  id: string;
  title: string;
};

export function tableOfContents(markdown: string): TocItem[] {
  const tree = remark().parse(markdown);
  const seen = new Map<string, number>();
  const toc: TocItem[] = [];

  visit(tree, 'heading', (node) => {
    if (node.depth !== 2) return;
    const title = toString(node).trim();
    if (!title) return;
    toc.push({ id: uniqueSlug(title, seen), title });
  });

  return toc;
}
