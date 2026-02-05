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

export function useNFT(): UseNFTResult {
  const [isLoading, setIsLoading] = useState(false);

  const mintNFT = useCallback(async (uri: string) => {
    setIsLoading(true);
    try {
      await openContractCall({
        network: new StacksTestnet(),
        contractAddress: "ST...",
        contractName: "serenehub-nft-marketplace",
        functionName: "mint",
        functionArgs: [stringAsciiCV(uri)],
        postConditionMode: PostConditionMode.Allow,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const listNFT = useCallback(async (tokenId: number, price: number) => {
    setIsLoading(true);
    try {
      await openContractCall({
        network: new StacksTestnet(),
        contractAddress: "ST...",
        contractName: "serenehub-nft-marketplace",
        functionName: "list-nft",
        functionArgs: [uintCV(tokenId), uintCV(price * 1_000_000)],
        postConditionMode: PostConditionMode.Allow,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

