/**
 * 站点全局配置 —— 改这里就能改全站信息
 */

export const SITE = {
  /** 站点名（页脚、RSS、OG 用） */
  name: 'Skydoge',
  /** 完整标题（首页 <title>、RSS 标题） */
  title: "Skydoge's Blog",
  /** 站点描述（SEO / OG / RSS） */
  description: "Skydoge 的个人博客 —— 技术笔记、踩坑记录与随想。",
  /** 作者 */
  author: 'Skydoge',
  /** 部署地址（GitHub Pages 用户站点） */
  url: 'https://skydoge-zjm.github.io',
  locale: 'zh-CN',
  /** 一句话签名，首页展示 */
  tagline: '记录技术，也记录生活。',
  /** 顶部导航 */
  nav: [
    { text: '文章', href: '/blog' },
    { text: '标签', href: '/tags' },
    { text: '归档', href: '/archives' },
    { text: '关于', href: '/about' },
    { text: '友链', href: '/links' },
  ],
  /** 社交链接 */
  social: {
    github: 'https://github.com/Skydoge-zjm',
    email: '2984095138@qq.com',
    rss: '/rss.xml',
  },
  /** 每页文章数（首页「最近文章」） */
  homePostCount: 5,
} as const;

/**
 * Giscus 评论配置
 *
 * 开启步骤：
 *   1. 到 https://giscus.app 输入仓库 Skydoge-zjm/Skydoge-zjm.github.io
 *   2. 确认仓库已开启 Discussions（Settings → General → Features → Discussions）
 *   3. 选择分类（建议 Announcements），页面会生成一段 <script ...> 代码
 *   4. 把代码里的 data-repo-id / data-category-id 填到下面
 * 填好之后评论会自动出现在每篇文章底部；不填则整站不显示评论区。
 */
export const GISCUS = {
  repo: 'Skydoge-zjm/Skydoge-zjm.github.io',
  repoId: '', // ← 填入 giscus.app 生成的 data-repo-id
  category: 'Announcements',
  categoryId: '', // ← 填入 giscus.app 生成的 data-category-id
  mapping: 'pathname',
  lang: 'zh-CN',
  themeLight: 'light',
  themeDark: 'dark_dimmed',
} as const;

/** Giscus 是否可用（三个 ID 齐全才启用） */
export const GISCUS_ENABLED = Boolean(GISCUS.repoId && GISCUS.categoryId);
