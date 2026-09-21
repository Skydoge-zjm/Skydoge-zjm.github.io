import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** 已发布文章，按发布日期倒序 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

/** 所有标签及对应文章数，按文章数降序 */
export function getTagCounts(posts: Post[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return new Map(
    [...counts.entries()].sort((a, b) =>
      b[1] === a[1] ? a[0].localeCompare(b[0], 'zh') : b[1] - a[1],
    ),
  );
}

/** 按年份分组，年份降序、组内保持传入顺序 */
export function groupByYear(posts: Post[]): [string, Post[]][] {
  const groups = new Map<string, Post[]>();
  for (const post of posts) {
    const year = String(post.data.pubDate.getFullYear());
    const list = groups.get(year) ?? [];
    list.push(post);
    groups.set(year, list);
  }
  return [...groups.entries()];
}

/**
 * 估算阅读时长：中文按 400 字/分钟，英文按 220 词/分钟
 */
export function readingTime(body: string): number {
  // CJK 统一表意文字（含扩展 A 区与兼容表意文字）
  const cjkRe = /[㐀-䶿一-鿿豈-﫿]/g;
  const cjk = (body.match(cjkRe) ?? []).length;
  const words = (
    body.replace(cjkRe, ' ').match(/[A-Za-z0-9_'-]+/g) ?? []
  ).length;
  return Math.max(1, Math.ceil(cjk / 400 + words / 220));
}
