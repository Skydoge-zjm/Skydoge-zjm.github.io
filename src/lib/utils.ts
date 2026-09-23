import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** YYYY-MM-DD。日期一律在前端算好再渲染，
 *  避免 Astro 模板里跨行写表达式时产生的换行被渲染成空格、导致日期在窄屏断行 */
export function formatDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * 由 slug 派生一个稳定的 6 位短 ID（FNV-1a → base36），
 * 形如 git 短提交号。每次构建结果一致，可用来引用某一篇。
 */
export function postId(slug: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < slug.length; i++) {
    hash ^= slug.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36).slice(-6).padStart(6, '0');
}

/** 已发布文章，按发布日期倒序 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

/** 按共同标签推荐相关文章，优先标签重合度，再按日期倒序 */
export function getRelatedPosts(post: Post, posts: Post[], limit = 3): Post[] {
  const tags = new Set(post.data.tags);
  if (tags.size === 0) return [];

  return posts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => ({
      post: candidate,
      score: candidate.data.tags.reduce(
        (count, tag) => count + Number(tags.has(tag)),
        0,
      ),
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf(),
    )
    .slice(0, limit)
    .map(({ post: candidate }) => candidate);
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
