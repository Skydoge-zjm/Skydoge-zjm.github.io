/**
 * 站点全局配置 —— 改这里就能改全站信息
 */

export const SITE = {
  /** 站点名（页脚、RSS、OG 用） */
  name: 'Skydoge',
  /** 完整标题（首页 <title>、RSS 标题） */
  title: "Skydoge's Blog",
  /** 站点描述（SEO / OG / RSS） */
  description: 'Skydoge 的写字地方。技术笔记、踩坑记录，偶尔胡思乱想。',
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
