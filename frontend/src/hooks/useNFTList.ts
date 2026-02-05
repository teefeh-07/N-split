// NFT List Hook

import { useState, useEffect } from 'react';

import type { NFT } from '@/types/contracts';

interface UseNFTListResult {
  nfts: NFT[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

