/**
 * TalkChat Studio Brand Constants
 * 
 * Brand colors extracted from the logo:
 * - Primary: Orange (#FF8C42)
 * - Secondary: Purple (#3D2E5C)
 */

export const BRAND_COLORS = {
  orange: {
    hex: '#FF8C42',
    rgb: 'rgb(255, 140, 66)',
    oklch: 'oklch(68% 0.17 45)',
  },
  purple: {
    hex: '#3D2E5C',
    rgb: 'rgb(61, 46, 92)',
    oklch: 'oklch(30% 0.08 285)',
  },
  cream: {
    hex: '#FFF5E6',
    rgb: 'rgb(255, 245, 230)',
    oklch: 'oklch(97% 0.02 75)',
  },
} as const;

export const BRAND_INFO = {
  name: 'TalkChat Studio',
  tagline: 'Conversations that Connect. Automation that Converts.',
  description: 'Multi-tenant conversational AI platform for businesses',
  logo: '/logo.svg',
  favicon: '/favicon.ico',
} as const;

export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/talkchatstudio',
  github: 'https://github.com/talkchatstudio',
  linkedin: 'https://linkedin.com/company/talkchatstudio',
  email: 'hello@talkchatstudio.com',
} as const;

export const APP_ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  chatbots: '/dashboard/chatbots',
  inbox: '/dashboard/inbox',
  analytics: '/dashboard/analytics',
  settings: '/dashboard/settings',
  team: '/dashboard/team',
  billing: '/dashboard/billing',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
} as const;
