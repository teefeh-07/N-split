// Wallet Info Hook

import { useState, useEffect } from 'react';

import { getBalance } from '@/services/stacks';

interface WalletInfo {
  stxBalance: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

