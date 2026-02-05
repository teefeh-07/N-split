// NFT Hook

import { useState, useCallback } from 'react';

import { openContractCall } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { uintCV, stringAsciiCV, PostConditionMode } from '@stacks/transactions';

interface UseNFTResult {
  mintNFT: (uri: string) => Promise<void>;
  listNFT: (tokenId: number, price: number) => Promise<void>;
  buyNFT: (tokenId: number) => Promise<void>;
  isLoading: boolean;
}

