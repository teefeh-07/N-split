// Platform Constants

export const APP_INFO = {
  name: 'SereneHub',
  description: 'Premium DeFi Platform on Stacks',
  version: '1.0.0',
  url: 'https://serenehub.app',
} as const;

export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/serenehub',
  discord: 'https://discord.gg/serenehub',
  github: 'https://github.com/serenehub',
  telegram: 'https://t.me/serenehub',
} as const;

export const FEATURE_FLAGS = {
  enableStaking: true,
  enableNFT: true,
  enableLaunchpad: true,
  enableServices: true,
  enableGovernance: false,
} as const;
