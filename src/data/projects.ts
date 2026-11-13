export interface Project {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  href: string;
  source?: string;
  tags: string[];
}

/** 首页展示的真实项目，详情指向站内使用指南。 */
export const PROJECTS: Project[] = [
  {
    name: 'DailyFlow',
    description: '一个本地优先的 Windows 日程管理工具。用桌面应用、悬浮窗和便签安排日常，也可以让 AI Agent 通过对话帮你整理任务。',
    image: '/images/dailyflow/dailyflow-main.png',
    imageAlt: 'DailyFlow 桌面应用：当天任务、周历、快速添加和桌面便签',
    imageWidth: 1360,
    imageHeight: 1000,
    href: '/blog/dailyflow-guide/',
    source: 'https://github.com/Skydoge-zjm/DailyFlow',
    tags: ['Windows', '本地优先', 'AI Agent'],
  },
];
