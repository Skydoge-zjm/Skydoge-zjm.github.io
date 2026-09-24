#!/usr/bin/env node
/**
 * 新文章脚手架
 *
 * 用法：
 *   npm run new -- "文章标题" [slug]
 *
 * 示例：
 *   npm run new -- "我的第一篇文章" my-first-post
 *
 * 不带 slug 时会用日期 + 序号兜底。生成的文件在
 * src/content/blog/<slug>.md，默认是草稿（draft: true），
 * 改完手动设为 false 再发布。
 */
import { writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const title = args[0]?.trim();

if (!title) {
  console.error('请提供文章标题，例如：npm run new -- "文章标题" slug');
  process.exit(1);
}

const today = new Date();
const pad = (n) => String(n).padStart(2, '0');
const date = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

let slug = args[1]?.trim();
if (!slug) {
  let i = 1;
  do {
    slug = `post-${i}`;
    i += 1;
  } while (existsSync(resolve(root, 'src/content/blog', `${slug}.md`)));
}

const file = resolve(root, 'src/content/blog', `${slug}.md`);
if (existsSync(file)) {
  console.error(`文件已存在：src/content/blog/${slug}.md`);
  process.exit(1);
}

const content = `---
title: "${title}"
description: "一句话摘要"
pubDate: ${date}
category: "分类名称"
tags: []
draft: true
---

在这里开始写正文。
`;

writeFileSync(file, content, 'utf8');
console.log(`已创建：src/content/blog/${slug}.md`);
