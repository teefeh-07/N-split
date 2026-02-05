// Contract Type Definitions

export interface NFT {
  id: number;
  owner: string;
  uri: string;
  price?: number;
  isListed: boolean;
}

