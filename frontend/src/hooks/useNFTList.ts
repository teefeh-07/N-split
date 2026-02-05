// NFT List Hook

import { useState, useEffect } from 'react';

import type { NFT } from '@/types/contracts';

interface UseNFTListResult {
  nfts: NFT[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useNFTList(): UseNFTListResult {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch from contract or indexer
      // Placeholder for now
      setNfts([]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  return { nfts, isLoading, error, refetch: fetchNFTs };
}
