// NFT Service

import api from './api';
import type { NFT } from '@/types/contracts';

export async function getNFTs(limit = 20, offset = 0): Promise<NFT[]> {
  const response = await api.get(`/extended/v1/tokens/nft`, {
    params: { limit, offset }
  });
  return response.data.results;
}

export async function getNFTById(tokenId: number): Promise<NFT | null> {
  try {
    const response = await api.get(`/extended/v1/tokens/nft/${tokenId}`);
    return response.data;
  } catch {
    return null;
  }
}

export async function getNFTsByOwner(address: string): Promise<NFT[]> {
  const response = await api.get(`/extended/v1/address/${address}/nft_events`);
  return response.data.nft_events;
}
