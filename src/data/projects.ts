export interface Project {
  name: string;
  description: string;
  href: string;
  source?: string;
}

/** 「关于」页的产品，按展示顺序排列。 */
export const PROJECTS: Project[] = [
  {
    name: 'Topolumia',
    description: '本地优先的科研工作台，让 Agent 跨会话接续研究，由研究者对照文献原文和实验记录确认结论。',
    href: 'https://skydoge-zjm.github.io/Topolumia/',
    source: 'https://github.com/Skydoge-zjm/Topolumia',
  },
  {
    name: 'Runicorn',
    description: '在本机或 GPU 服务器上记录训练过程，对比多次实验的指标曲线。',
    href: 'https://skydoge-zjm.github.io/Runicorn/',
    source: 'https://github.com/Skydoge-zjm/Runicorn',
  },
  {
    name: 'DailyFlow',
    description: '在 Windows 桌面安排日程，也可以让 Agent 读写同一份本地任务清单。',
    href: '/blog/dailyflow-guide/',
    source: 'https://github.com/Skydoge-zjm/DailyFlow',
  },
];
