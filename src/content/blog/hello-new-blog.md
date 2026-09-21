---
title: "你好，新博客"
description: "旧的 Hexo 模板博客退役了。这是用 Astro 从零重建的新家，以及我打算在这里写什么。"
pubDate: 2026-09-21
tags: ["随笔", "建站"]
pinned: true
---

这个域名挂了很久的「默认 Hexo 模板」——一篇 `hello-world`，加上一套从未动过的主题。是时候推倒重来了。

## 为什么重建

旧站与其说是个博客，不如说是一块「我注册过 GitHub Pages」的墓碑。每次想写点东西，打开后台看到那个陌生主题的配置项，写字的兴致就先没了一半。

这次换了个思路：**先让写作变得没有摩擦，再谈别的**。于是有了你现在看到的这个站。

## 新家用什么盖的

- **[Astro](https://astro.build/)** —— 静态站点生成器，默认零 JS 输出，页面里只有内容和必要的交互
- **[Tailwind CSS v4](https://tailwindcss.com/)** —— 样式全部手写，没有臃肿的主题包
- **Pagefind** —— 本地全文搜索，索引在构建时生成，不依赖任何后端
- **Giscus** —— 评论基于 GitHub Discussions，数据存在自己的仓库里

整套东西的源码都在 [Skydoge-zjm/Skydoge-zjm.github.io](https://github.com/Skydoge-zjm/Skydoge-zjm.github.io)，每次 `git push` 由 GitHub Actions 自动构建部署，写作链路只有两步：`npm run new`，然后写字。

## 会写点什么

大概逃不出这几类：

- **技术笔记** —— 踩过的坑、读过的源码、觉得值得记下来的实现细节
- **工具与效率** —— 真正留在工作流里的那些
- **随笔** —— 不定期的自言自语

更新频率随缘，但每一篇都会是写完自己会回头再看的那种。

> 如果你也在考虑重建自己的博客：最好的时机就是现在，第二好的是写完这篇之后。
