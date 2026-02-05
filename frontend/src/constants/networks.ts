// Network Constants

export enum Network {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  DEVNET = 'devnet',
}

export const NETWORK_CONFIG = {
  [Network.MAINNET]: {
    apiUrl: "https://stacks-node-api.mainnet.stacks.co",
    explorerUrl: "https://explorer.stacks.co",
  },
  [Network.TESTNET]: {
    apiUrl: "https://stacks-node-api.testnet.stacks.co",
    explorerUrl: "https://explorer.stacks.co/?chain=testnet",
  },
  [Network.DEVNET]: {
    apiUrl: "http://localhost:3999",
    explorerUrl: "http://localhost:8000",
  },
} as const;
