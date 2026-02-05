// Contract Type Definitions

export interface NFT {
  id: number;
  owner: string;
  uri: string;
  price?: number;
  isListed: boolean;
}

export interface StakePosition {
  amount: number;
  stakedAt: number;
  rewards: number;
}

export interface Token {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
}

export interface Service {
  id: number;
  provider: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
}

