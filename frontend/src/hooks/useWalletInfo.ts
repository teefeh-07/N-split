// Wallet Info Hook

import { useState, useEffect } from 'react';

import { getBalance } from '@/services/stacks';

interface WalletInfo {
  stxBalance: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWalletInfo(address: string | null): WalletInfo {
  const [stxBalance, setStxBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!address) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBalance(address);
      setStxBalance(parseInt(data.stx?.balance || '0') / 1_000_000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [address]);

  return { stxBalance, isLoading, error, refetch: fetchBalance };
}
