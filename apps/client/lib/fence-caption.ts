import { visit } from 'unist-util-visit';

import { readCodeCaption } from './code-caption';

export function remarkFenceCaption() {
  return (tree: Parameters<typeof visit>[0]) => {
    visit(tree, 'code', (node) => {
      const caption = readCodeCaption((node as { meta?: string | null }).meta);
      if (!caption) return;
      const code = node as { data?: { hProperties?: Record<string, string> } };
      const data = (code.data ??= {});
      data.hProperties = { ...data.hProperties, 'data-caption': caption };
    });
  };
}
