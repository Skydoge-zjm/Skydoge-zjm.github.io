import rss from '@astrojs/rss';
import { SITE } from '../consts';
import { getPublishedPosts } from '../lib/utils';

export async function GET(context: { site?: URL }) {
  const posts = await getPublishedPosts();
  const site = context.site ?? new URL(SITE.url);

  return rss({
    title: SITE.title,
    description: SITE.description,
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: `<language>zh-CN</language>`,
  });
}
