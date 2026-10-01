import "server-only";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

/**
 * Article markdown → HTML (server-side, cached per request by React).
 * GFM tables/task-lists, heading ids for the ToC, syntax highlighting.
 * Content is authored in the admin panel (trusted), not user-submitted.
 */
export async function renderMarkdown(md: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeHighlight, { detect: false })
    .use(rehypeStringify)
    .process(md);
  return String(file);
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", apos: "'" };

/**
 * The h2/h3 headings of rendered article HTML, with the ids rehype-slug gave
 * them, for a table of contents built on the server.
 */
export function extractHeadings(html: string): { id: string; text: string; level: number }[] {
  const out: { id: string; text: string; level: number }[] = [];
  const re = /<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/g;
  for (const match of html.matchAll(re)) {
    const id = /\sid="([^"]+)"/.exec(match[2])?.[1];
    if (!id) continue;
    const text = match[3]
      .replace(/<[^>]+>/g, "")
      .replace(/&(#?\w+);/g, (_, e: string) => ENTITIES[e] ?? `&${e};`)
      .trim();
    out.push({ id, text, level: Number(match[1]) });
  }
  return out;
}
