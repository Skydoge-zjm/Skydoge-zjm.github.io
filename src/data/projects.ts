export interface Project {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  source?: string;
  tags: string[];
}

/** 首页项目展示数据。补齐项目资料后即可直接渲染。 */
export const PROJECTS: Project[] = [];
