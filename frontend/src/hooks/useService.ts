// Service Hook

import { useState, useCallback } from 'react';

import { openContractCall } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { stringAsciiCV, uintCV, PostConditionMode } from '@stacks/transactions';

interface UseServiceResult {
  registerService: (name: string, description: string, price: number) => Promise<void>;
  payService: (serviceId: number) => Promise<void>;
  isLoading: boolean;
}

export function useService(): UseServiceResult {
  const [isLoading, setIsLoading] = useState(false);

  const registerService = useCallback(async (name: string, description: string, price: number) => {
    setIsLoading(true);
    try {
      await openContractCall({
        network: new StacksTestnet(),
        contractAddress: "ST...",
        contractName: "serenehub-service-registry",
        functionName: "register-service",
        functionArgs: [stringAsciiCV(name), stringAsciiCV(description), uintCV(price * 1_000_000)],
        postConditionMode: PostConditionMode.Allow,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

