# Skydoge's Blog

个人博客，基于 [Astro](https://astro.build/) + [Tailwind CSS v4](https://tailwindcss.com/) 从零手写，
部署在 GitHub Pages：<https://skydoge-zjm.github.io>。开发和构建需要 Node.js 22.19.0 或更高版本。

```bash
npm install        # 安装依赖
npm run dev        # 本地开发（默认 http://localhost:4321）
npm run check      # Astro 类型与组件检查
npm run build      # 构建到 dist/ 并生成 Pagefind 搜索索引
npm run preview    # 本地预览构建产物
npm run new -- "文章标题" slug   # 按模板新建文章
```

## 目录结构

```
src/
├── content.config.ts     # 内容集合 schema（文章的字段定义在这里）
├── content/blog/         # 所有文章，一个 .md 文件就是一篇
├── consts.ts             # 站点信息、导航、社交链接
├── lib/utils.ts          # 文章排序 / 标签统计 / 阅读时长 / 相关文章
├── lib/markdown-plugins.mjs # 数学、提示块、图片、表格的静态处理
├── styles/global.css     # 设计变量（配色、字体、间距）+ 全部自定义样式
├── layouts/
│   ├── BaseLayout.astro  # 全站骨架：head、导航、页脚、主题初始化
│   └── PostLayout.astro  # 文章页：标题、元信息、目录、系列与相关文章
├── components/           # Sidebar / Footer / PostCard / Tag / ThemeToggle ...
└── pages/                # 路由即文件
    ├── index.astro       # 首页
    ├── blog/             # 文章列表 + 文章详情
    ├── tags/             # 标签页
    ├── archives.astro    # 归档
    ├── about.astro       # 关于
    ├── links.astro       # 友链
    ├── search.astro      # 搜索
    ├── 404.astro
    └── rss.xml.ts        # RSS 订阅源
public/                   # 原样拷贝到根路径（favicon、robots.txt）
.github/workflows/        # 部署流水线
scripts/new-post.mjs      # 新文章脚手架
```

## 写文章

```bash
npm run new -- "文章标题" my-post
```

生成 `src/content/blog/my-post.md`，默认是草稿（`draft: true`，不参与构建）。
写完把 `draft` 改成 `false`，`git push` 后自动上线。

```markdown
---
title: "文章标题"
description: "一句话摘要，显示在列表页和 RSS 里"
pubDate: 2026-09-21
tags: ["标签一", "标签二"]
draft: false
pinned: false        # 可选，置顶
updatedDate: 2026-09-22   # 可选
series: "系列名称"   # 可选，系列文章
seriesOrder: 1       # 可选，系列中的顺序（需设置 series）
---
```

## Markdown 写作功能

文章由 Astro 在构建时生成静态 HTML；数学公式、脚注和提示块无需在访客浏览器中跑一整套 Markdown 渲染器。

### 数学公式与脚注

```markdown
行内公式：$E = mc^2$

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

脚注引用[^source]

[^source]: 脚注会在文章末尾生成返回正文链接。
```

### 提示块

使用容器指令，支持 `note`、`tip`、`important`、`warning`、`caution`、`danger`、`success`：

```markdown
:::warning[标题可自定义]
这里写提示内容，可以包含常规 Markdown。
:::
```

### 代码块

已有 Shiki 亮/暗双主题和复制按钮。围栏元信息支持文件名、行号和行高亮：

````markdown
```ts title="src/example.ts" showLineNumbers {2,4}
const answer = 42;
console.log(answer);
```
````

使用 Shiki 注释标记展示 diff、强调或聚焦行：

```ts
const oldValue = 1; // [!code --]
const newValue = 2; // [!code ++]
console.log(newValue); // [!code highlight]
```

### 图表、图片与标题锚点

- Mermaid：使用 `mermaid` 代码围栏；只有包含图表的文章才按需加载图表脚本，图表主题跟随站点亮/暗模式。
- 图片说明：`![有意义的替代文本](图片地址 "图片说明"){width=1200 height=800}`。填写图片原始宽高可以避免加载时布局跳动；独立图片可点击或键盘聚焦后放大，按 `Esc` 关闭。
- 标题旁的 `¶` 可复制该章节的直达链接。
- 建议为有意义的图片写清楚 alt；纯装饰图可以显式写 `alt=""`。

### 文章元数据

Frontmatter 可选添加 `series` 和 `seriesOrder`。同系列文章会展示系列目录；没有同标签相关文章时不会出现空推荐区。文章页还包含移动端目录、阅读进度、分享/复制链接、打印样式和 BlogPosting 结构化数据。

## 功能说明

| 功能 | 实现方式 |
| --- | --- |
| 暗色模式 | `class="dark"` + `localStorage`，跟随系统偏好，首屏前内联脚本消除闪白 |
| Markdown | 数学公式（KaTeX）、脚注、提示块、GFM 表格/任务清单、Mermaid 图表 |
| 代码高亮 | Shiki 双主题、文件名、行号、行高亮/diff、复制按钮 |
| 图片 | 替代文本诊断、延迟加载、说明文字和键盘可用灯箱 |
| 阅读体验 | 响应式目录、章节链接、阅读进度、返回顶部、分享与复制 |
| 文章发现 | 标签筛选、Pagefind 搜索快捷键、相关文章、系列文章 |
| SEO / 输出 | canonical、Open Graph、BlogPosting JSON-LD、打印样式 |
| 搜索 | Pagefind，构建时生成到 `dist/pagefind/`，纯本地无后端 |
| RSS | `/rss.xml`，由 `@astrojs/rss` 生成 |
| 部署 | push 到 `main` → GitHub Actions 构建 → GitHub Pages 发布 |

## 改站点信息

绝大多数定制都集中在两个文件：

- **`src/consts.ts`** —— 站点名、简介、导航、社交链接
- **`src/styles/global.css`** —— 顶部的设计变量区，改 `--seal` 就能换全站强调色

## 部署

推送到 `main` 即自动触发 `.github/workflows/deploy.yml`：
安装依赖 → `npm run build`（含 Pagefind 索引）→ 上传产物 → 发布到 Pages。

> 仓库的 **Settings → Pages → Source** 需要是 **GitHub Actions**（只需设置一次）。
