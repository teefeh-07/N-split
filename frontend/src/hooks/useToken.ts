// Token Hook

import { useState, useCallback } from 'react';

import { openContractCall } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { stringAsciiCV, uintCV, PostConditionMode } from '@stacks/transactions';

interface UseTokenResult {
  createToken: (name: string, symbol: string, supply: number) => Promise<void>;
  isLoading: boolean;
}

export function useToken(): UseTokenResult {
  const [isLoading, setIsLoading] = useState(false);

  const createToken = useCallback(async (name: string, symbol: string, supply: number) => {
    setIsLoading(true);
    try {
      await openContractCall({
        network: new StacksTestnet(),
        contractAddress: "ST...",
        contractName: "serenehub-token-launchpad",
        functionName: "create-token",
        functionArgs: [stringAsciiCV(name), stringAsciiCV(symbol), uintCV(supply)],
        postConditionMode: PostConditionMode.Allow,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createToken, isLoading };
}
