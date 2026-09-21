---
title: "把 Astro 博客部署到 GitHub Pages"
description: "从零到上线：Astro 项目 + GitHub Actions 自动构建 + 用户站点根路径部署的完整流程，以及搜索索引和评论的处理。"
pubDate: 2026-09-18
tags: ["Astro", "GitHub Pages", "部署"]
---

搭个人博客，部署当然是越省事越好。GitHub Pages 免费、自带 CDN，配上 GitHub Actions 可以做到 `git push` 即上线。这篇记录本站的部署方案。

## 整体链路

```
本地写 Markdown
   ↓ git push
GitHub Actions（ubuntu-latest）
   ↓ npm ci && npm run build
dist/ 静态产物（含 Pagefind 搜索索引）
   ↓ upload-pages-artifact
GitHub Pages 发布
```

## 一、astro.config.mjs

用户站点（`用户名.github.io`）部署在根路径，所以不需要配 `base`，但要指定 `site`，RSS 和 sitemap 才能生成正确的绝对地址：

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://skydoge-zjm.github.io',
  integrations: [sitemap()],
});
```

## 二、构建脚本

搜索索引必须在 Astro 构建**之后**生成，否则 `dist/` 里还没有 HTML 可索引：

```json
{
  "scripts": {
    "build": "astro build && pagefind --site dist"
  }
}
```

## 三、GitHub Actions 工作流

在 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

几个容易踩的点：

- **`concurrency` 必须有**。否则连续 push 时多个部署任务互相覆盖，站点会出现「上一版内容」的诡异状态。
- **`permissions` 要显式写**。默认 token 是只读的，`pages: write` 和 `id-token: write` 缺一不可。
- **Node 版本建议锁 22**，和本地保持一致，避免「本地好的、CI 挂」。

## 四、打开 Pages 开关

推送后到仓库 **Settings → Pages → Source** 选 **GitHub Actions**。

这一步只能手动点，没有 API 之外的捷径。选完稍等一分钟， Actions 跑绿，站点就上线了。

## 五、自定义域名（可选）

如果以后想绑自己的域名，在仓库根目录放一个 `CNAME` 文件写入域名，再到 Pages 设置里填上即可。用户站点默认地址是 `https://skydoge-zjm.github.io`，不绑域名也完全够用。
