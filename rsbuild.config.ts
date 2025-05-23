import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginMdx } from "@rsbuild/plugin-mdx";
import rehypeStarryNight from "rehype-starry-night";
import rehypeMermaid from "rehype-mermaid";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkToc from "remark-toc";
import remarkParse from "remark-parse";
import { remark } from "remark";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { toc } from "mdast-util-toc";
import { toMarkdown } from "mdast-util-to-markdown";
import rehypeWrap from "rehype-wrap";
import remarkCustomHeaderId from "remark-custom-header-id";

import { visit } from "unist-util-visit";
import { selectAll } from "hast-util-select";
import { parseSelector } from "hast-util-parse-selector";

const __dirname = path.resolve();

// writes a toc to a separate file as markdown
const TocFilePlugin = () => ({
  name: "toc-generator",
  setup(api: any) {
    api.onBeforeCreateCompiler(async () => {
      function extractToc(markdown, tocOptions = {}) {
        // 1 · parse the document to an MDAST
        const tree = remark()
          .use(remarkParse)
          .use(remarkCustomHeaderId)
          .parse(markdown);

        // 2 · generate a TOC node (does **not** change `tree`)
        const { map } = toc(tree, tocOptions); // `map` can be null if no headings

        // 3 · turn that node back into markdown
        return map ? toMarkdown(map) : "";
      }

      const filePath = path.join(api.context.rootPath, "src/home.mdx");
      const content = await readFile(filePath, "utf-8");
      const tocString = extractToc(content);

      await writeFile(
        path.join(api.context.rootPath, "build/home.toc.md"),
        String(tocString)
      );
    });
  },
});

// wraps mermaid diagrams in a div.mermaid-container
const mermaidDivWrapperPlugin =
  (options = { selector: "svg[id^='mermaid-']" }) =>
  (tree) => {
    for (const match of selectAll(options.selector, tree)) {
      visit(tree, match, (node, i, parent) => {
        if (!parent) return;
        if (!i) return;
        const wrapper = parseSelector("div.mermaid-container");
        wrapper.children = [node];
        parent.children[i] = wrapper;
      });
    }
  };

export default defineConfig({
  html: {
    template: "./static/index.html",
  },
  plugins: [
    TocFilePlugin(),
    pluginReact(),
    pluginMdx({
      mdxLoaderOptions: {
        remarkPlugins: [
          remarkCustomHeaderId,
          // [remarkToc, { ordered: false, maxDepth: 3, tight: true }],
        ],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                class: "toc-link",
              },
            },
          ],
          rehypeStarryNight,
          rehypeMermaid,
          mermaidDivWrapperPlugin,
        ],
      },
    }),
  ],
});
