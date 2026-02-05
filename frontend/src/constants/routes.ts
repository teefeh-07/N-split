// Route Constants

export const ROUTES = {
  HOME: '/',
  MARKETPLACE: '/marketplace',
  STAKING: '/staking',
  LAUNCHPAD: '/launchpad',
  SERVICES: '/services',
  PROFILE: '/profile',
} as const;

export const NAV_ITEMS = [
  { label: 'Home', path: ROUTES.HOME },
  { label: 'Marketplace', path: ROUTES.MARKETPLACE },
  { label: 'Staking', path: ROUTES.STAKING },
  { label: 'Launchpad', path: ROUTES.LAUNCHPAD },
  { label: 'Services', path: ROUTES.SERVICES },
] as const;
