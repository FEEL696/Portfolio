import React from 'react';
import { Bot, Code, Layout, Settings, Sparkles } from 'lucide-react';
import { ServiceIconName } from '../types/portfolio.ts';

export function getServiceIcon(name: ServiceIconName, isDark?: boolean) {
  const className = `w-6 h-6 ${isDark ? 'text-black' : 'text-white'}`;

  switch (name) {
    case 'Layout':
      return <Layout className={className} />;
    case 'Code':
      return <Code className={className} />;
    case 'Settings':
      return <Settings className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Bot':
      return <Bot className={className} />;
    default:
      return null;
  }
}
