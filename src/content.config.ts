import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  // 从 src/content/blog 加载全部 Markdown 文章
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: z.object({
    /** 文章标题 */
    title: z.string(),
    /** 摘要，用于列表页 / RSS / OG */
    description: z.string(),
    /** 发布日期 */
    pubDate: z.coerce.date(),
    /** 更新日期（可选） */
    updatedDate: z.coerce.date().optional(),
    /** 主分类：每篇文章唯一 */
    category: z.string().trim().min(1),
    /** 标签 */
    tags: z.array(z.string()).default([]),
    /** 系列文章名称（可选） */
    series: z.string().trim().min(1).optional(),
    /** 系列内排序（可选；需要先设置 series） */
    seriesOrder: z.number().int().positive().optional(),
    /** 置顶（可选） */
    pinned: z.boolean().default(false),
    /** 草稿（true 时不参与构建输出） */
    draft: z.boolean().default(false),
  }).refine((data) => data.series || data.seriesOrder === undefined, {
    path: ['seriesOrder'],
    message: 'seriesOrder requires a series name',
  }),
});

export const collections = { blog };
