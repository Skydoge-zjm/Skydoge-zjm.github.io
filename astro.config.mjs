import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { satteri } from '@astrojs/markdown-satteri';
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
} from '@shikijs/transformers';
import { imageDimensionsPlugin, calloutPlugin, contentHastPlugin } from './src/lib/markdown-plugins.mjs';

const codeBlockMeta = {
  name: 'blog-code-block-meta',
  pre(hast) {
    const meta = String(this.options.meta?.__raw ?? '');
    const title = meta.match(/(?:^|\s)title=(?:"([^"]+)"|'([^']+)'|(\S+))/);
    if (title) {
      const label = title[1] ?? title[2] ?? title[3];
      hast.children.unshift({
        type: 'element',
        tagName: 'span',
        properties: { className: ['code-title'] },
        children: [{ type: 'text', value: label }],
      });
      this.addClassToHast(hast, 'has-title');
    }
    if (/(?:^|\s)(?:showLineNumbers|lineNumbers)(?:\s|$)/.test(meta)) {
      this.addClassToHast(hast, 'has-line-numbers');
    }
  },
};

export default defineConfig({
  // 博客部署在 GitHub Pages 用户站点根路径
  site: 'https://skydoge-zjm.github.io',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    processor: satteri({
      features: {
        gfm: {
          footnotes: {
            label: '脚注',
            backContent: '↩',
            backLabel: '返回正文 {reference}',
          },
        },
        math: true,
        directive: true,
      },
      mdastPlugins: [imageDimensionsPlugin, calloutPlugin],
      hastPlugins: [contentHastPlugin],
    }),
    // 双主题代码高亮：亮色 / 暗色由 .dark 类切换
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
      transformers: [
        transformerMetaHighlight(),
        transformerMetaWordHighlight(),
        transformerNotationHighlight(),
        transformerNotationFocus(),
        transformerNotationDiff(),
        codeBlockMeta,
      ],
    },
  },
});
