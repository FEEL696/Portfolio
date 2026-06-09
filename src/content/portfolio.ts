import { PortfolioContent, Project, ProjectId, Service } from '../types/portfolio.ts';

const projects: Project[] = [
  {
    id: '1',
    title: 'ARC Trading',
    description:
      'Сайт для криптовалютной компании, предоставляющей услуги маркет-мейкинга. фокус на чёткой подаче ценностного предложения, формировании доверия и сильном впечатлении.',
    stack: ['React', 'Three.js', 'TypeScript'],
    image: 'https://iili.io/f4fgRpI.webp',
    href: 'https://www.arctrading.io/',
    galleryImages: [
      'https://iili.io/f4qYulR.webp',
      'https://bs.boomstream.com/balancer/tfNZNLb0-uDOlgdNc.mp4',
      'https://iili.io/f4qY5HN.webp',
      'https://bs.boomstream.com/balancer/HmimaZ01-uDOlgdNc.mp4',
      'https://bs.boomstream.com/balancer/tGbdj3rP-uDOlgdNc.mp4',
    ],
  },
  {
    id: '2',
    title: 'Kodiak',
    description:
      'Kodiak — компания, поддерживающая новое поколение владельцев малого бизнеса через долевое финансирование и долгосрочное операционное партнерство.',
    stack: ['D3.js', 'Next.js', 'Tailwind'],
    image: 'https://iili.io/f4fgu7p.webp',
    galleryImages: [
      'https://iili.io/f4qYASp.webp',
      'https://bs.boomstream.com/balancer/g2w9OviK-3aLokGCi.mp4',
      'https://iili.io/f4qY7RI.webp',
      'https://bs.boomstream.com/balancer/TFFZOfdR-3aLokGCi.mp4',
    ],
  },
  {
    id: '3',
    title: 'Numio',
    description:
      'Концепт-дизайн Numio — мобильного приложения для персонального финансового учёта с фокусом на отслеживание доходов и расходов.',
    stack: ['Python', 'WebGL', 'React'],
    image: 'https://iili.io/f4fgzrv.webp',
    galleryImages: [
      'https://iili.io/f4qYlxn.webp',
      'https://iili.io/f4qYMl4.webp',
      'https://iili.io/f4qYXJ2.webp',
      'https://iili.io/f4qYjO7.webp',
      'https://iili.io/f4qYeWu.webp',
      'https://iili.io/f4qYkib.webp',
    ],
  },
  {
    id: '4',
    title: 'ARVE’',
    description:
      'Международный сервис подбора, продажи и аренды арт-объектов для интерьера, инвестиций, коллабораций, частных коллекций и подарков.',
    stack: ['Shopify', 'Motion', 'Next.js'],
    image: 'https://iili.io/f4fgT2R.webp',
    href: 'https://arve.art/',
    galleryImages: [
      'https://iili.io/f4fgT2R.webp',
      'https://bs.boomstream.com/balancer/fGf3OUJU-3aLokGCi.mp4',
      'https://iili.io/f4qYxVa.webp',
    ],
  },
  {
    id: '5',
    title: 'Nimb',
    description:
      'Система управления проектами с учетом времени, задач и доходов. Трекинг через встроенный таймер, автоматический подсчет выполненных проектов, база клиентов и визуализация статистики.',
    stack: ['React', 'Python', 'WebSockets'],
    image: 'https://iili.io/f4fg7It.webp',
    galleryImages: [
      'https://iili.io/f4qYoog.webp',
      'https://bs.boomstream.com/balancer/qILLzOpm-uDOlgdNc.mp4',
      'https://iili.io/f4qY1iG.webp',
      'https://iili.io/f4qYVUl.webp',
    ],
  },
];

const services: Service[] = [
  {
    id: 'design',
    icon: 'Layout',
    title: 'Дизайн и прототипирование',
    description: 'Создаю макеты в Figma с продуманным UX — от концепции до готовой дизайн-системы.',
  },
  {
    id: 'webflow',
    icon: 'Code',
    title: 'Разработка на Webflow',
    description: 'Верстаю корпоративные сайты и лендинги на Webflow — быстро, адаптивно, с анимациями.',
  },
  {
    id: 'custom',
    icon: 'Settings',
    title: 'Кастомные веб-приложения',
    description:
      'Разрабатываю внутренние инструменты для бизнеса: таск-менеджеры, CRM-системы, панели управления проектами.',
  },
  {
    id: 'bots',
    icon: 'Bot',
    title: 'Чат-боты и автоматизация',
    description:
      'Автоматизирую бизнес-процессы: боты для клиентов, интеграции с CRM, рассылки и воркфлоу.',
  },
  {
    id: 'creative',
    icon: 'Sparkles',
    title: '3D, AI и креативные решения',
    description:
      'Интегрирую 3D-графику, AI-генерацию контента и нестандартные визуальные элементы в проекты.',
  },
];

export const portfolioContent: PortfolioContent = {
  projects,
  services,
};

export const PROJECTS = portfolioContent.projects;
export const SERVICES = portfolioContent.services;

export function getProjectById(projectId: ProjectId) {
  return PROJECTS.find((project) => project.id === projectId) ?? null;
}
