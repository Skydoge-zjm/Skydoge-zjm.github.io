# Skydoge's Blog

个人博客，基于 [Astro](https://astro.build/) + [Tailwind CSS v4](https://tailwindcss.com/) 从零手写，
部署在 GitHub Pages：<https://skydoge-zjm.github.io>

```bash
npm install        # 安装依赖
npm run dev        # 本地开发（默认 http://localhost:4321）
npm run build      # 构建到 dist/ 并生成 Pagefind 搜索索引
npm run preview    # 本地预览构建产物
npm run new -- "文章标题" slug   # 按模板新建文章
```

## 目录结构

```
src/
├── content.config.ts     # 内容集合 schema（文章的字段定义在这里）
├── content/blog/         # 所有文章，一个 .md 文件就是一篇
├── consts.ts             # 站点信息、导航、社交链接、Giscus 配置
├── lib/utils.ts          # 文章排序 / 标签统计 / 阅读时长
├── styles/global.css     # 设计变量（配色、字体、间距）+ 全部自定义样式
├── layouts/
│   ├── BaseLayout.astro  # 全站骨架：head、导航、页脚、主题初始化
│   └── PostLayout.astro  # 文章页：标题、元信息、目录、上下篇、评论区
├── components/           # Header / Footer / PostCard / Tag / ThemeToggle / Giscus ...
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
---
```

## 功能说明

| 功能 | 实现方式 |
| --- | --- |
| 暗色模式 | `class="dark"` + `localStorage`，跟随系统偏好，首屏前内联脚本消除闪白 |
| 代码高亮 | Shiki 双主题（github-light / github-dark），代码块带复制按钮 |
| 目录 | 文章页右侧浮动目录，滚动时高亮当前小节（≥3 个二级标题时显示） |
| 搜索 | Pagefind，构建时生成索引到 `dist/pagefind/`，纯本地无后端 |
| 评论 | Giscus（GitHub Discussions），见下方开启步骤 |
| RSS | `/rss.xml`，由 `@astrojs/rss` 生成 |
| 部署 | push 到 `main` → GitHub Actions 构建 → GitHub Pages 发布 |

## 开启评论（Giscus）

1. 仓库 **Settings → General → Features** 里打开 **Discussions**
2. 打开 <https://giscus.app>，填入仓库 `Skydoge-zjm/Skydoge-zjm.github.io`，
   分类选 `Announcements`，页面会生成一段 `<script>` 代码
3. 把代码里的 `data-repo-id` 和 `data-category-id` 填到 `src/consts.ts` 的 `GISCUS` 里

填好之后每篇文章底部会自动出现评论区；不填则整站不显示。

## 改站点信息

绝大多数定制都集中在两个文件：

- **`src/consts.ts`** —— 站点名、简介、导航、社交链接、Giscus 配置
- **`src/styles/global.css`** —— 顶部的设计变量区，改 `--accent` 就能换全站强调色

## 部署

推送到 `main` 即自动触发 `.github/workflows/deploy.yml`：
安装依赖 → `npm run build`（含 Pagefind 索引）→ 上传产物 → 发布到 Pages。

> 仓库的 **Settings → Pages → Source** 需要是 **GitHub Actions**（只需设置一次）。
