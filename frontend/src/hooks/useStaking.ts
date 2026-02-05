// Staking Hook

import { useState, useCallback } from 'react';

import { openContractCall } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { uintCV, PostConditionMode } from '@stacks/transactions';

interface UseStakingResult {
  stake: (amount: number) => Promise<void>;
  unstake: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useStaking(): UseStakingResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stake = useCallback(async (amount: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await openContractCall({
        network: new StacksTestnet(),
        contractAddress: "ST...",
        contractName: "serenehub-staking-vault",
        functionName: "stake",
        functionArgs: [uintCV(amount * 1_000_000)],
        postConditionMode: PostConditionMode.Allow,
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

