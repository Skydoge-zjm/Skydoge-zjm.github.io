---
title: "Markdown 写作演示"
description: "一篇用来验证渲染效果的文章：标题层级、代码高亮、表格、引用、图片等常见语法在这里都有示例。"
pubDate: 2026-09-15
tags: ["Markdown", "建站"]
---

这是本站的排版测试页。所有 Markdown 常见语法都在这里跑一遍，方便确认每篇文章的渲染效果。

## 行内元素

支持 **加粗**、*斜体*、~~删除线~~、`行内代码`，以及[超链接](https://astro.build/)。

数学公式、脚注这类扩展语法没有接入，有需要的话再加。

## 代码块

支持双主题高亮，右上角 hover 会出现复制按钮：

```ts
interface Post {
  title: string;
  pubDate: Date;
  tags: string[];
}

export function formatDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
```

```bash
# 新建一篇文章
npm run new -- "文章标题" slug-name

# 本地预览
npm run dev
```

## 表格

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 构建生产版本并生成搜索索引 |
| `npm run preview` | 本地预览构建产物 |
| `npm run new` | 按模板生成新文章 |

## 引用

> 简单是可靠的先决条件。
>
> —— Edsger W. Dijkstra

## 列表

有序列表：

1. 写 Markdown
2. `git push`
3. 等 GitHub Actions 部署完成

无序列表：

- 构建时生成静态页面
- 搜索索引构建时生成
- 评论走 Giscus，零后端

## 图片

![示例图片](https://picsum.photos/seed/skydoge/1200/600)

图片默认带圆角和细边框，和整体风格保持一致。

## 折叠块

<details>
<summary>点开看看</summary>

折叠内容用原生 `<details>` 实现，不需要任何 JS 组件。

</details>

---

排版没问题的话，就可以开始写正文了。
