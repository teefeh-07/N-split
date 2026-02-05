// SEO Configuration

export const defaultSEO = {
  title: 'SereneHub | Premium DeFi on Stacks',
  description: 'The all-in-one platform for NFTs, Tokens, Staking, and Services on the Stacks blockchain.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://serenehub.app',
    siteName: 'SereneHub',
  },
  twitter: {
    handle: '@serenehub',
    site: '@serenehub',
    cardType: 'summary_large_image',
  },
};

export const pageTitles = {
  home: 'SereneHub | Premium DeFi on Stacks',
  marketplace: 'NFT Marketplace | SereneHub',
  staking: 'Staking | SereneHub',
  launchpad: 'Token Launchpad | SereneHub',
  services: 'Services | SereneHub',
} as const;
