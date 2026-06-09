export type ProjectId = string;
export type ServiceId = 'design' | 'webflow' | 'custom' | 'bots' | 'creative';
export type ServiceIconName = 'Layout' | 'Code' | 'Settings' | 'Sparkles' | 'Bot';

export interface Project {
  id: ProjectId;
  title: string;
  description: string;
  stack: string[];
  image: string;
  galleryImages: string[];
  href?: string;
}

export interface Service {
  id: ServiceId;
  icon: ServiceIconName;
  title: string;
  description: string;
}

export interface PortfolioContent {
  projects: Project[];
  services: Service[];
}
