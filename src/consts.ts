/**
 * 站点全局配置 —— 改这里就能改全站信息
 */

export const AUTHOR_INTRO = [
  'AI Agent 研究者，也是开发者。',
  '关注 Agent 的故障诊断与自进化。',
] as const;

export const SITE = {
  /** 站点名（页脚、RSS、OG 用） */
  name: 'Skydoge',
  /** 完整标题（首页 <title>、RSS 标题） */
  title: "Skydoge's Blog",
  /** 站点描述（SEO / OG / RSS） */
  description: AUTHOR_INTRO.join(''),
  /** 作者 */
  author: 'Skydoge',
  /** 部署地址（GitHub Pages 用户站点） */
  url: 'https://skydoge-zjm.github.io',
  locale: 'zh-CN',
  /** 顶部导航 */
  nav: [
    { text: '文章', href: '/blog' },
    { text: '关于', href: '/about' },
    { text: '友链', href: '/links' },
  ],
  /** 社交链接 */
  social: {
    github: 'https://github.com/Skydoge-zjm',
    email: 'jmzhangskydoge@gmail.com',
    backupEmail: '2984095138@qq.com',
    rss: '/rss.xml',
  },
  /** 每页文章数（首页「最近文章」） */
  homePostCount: 5,
} as const;
