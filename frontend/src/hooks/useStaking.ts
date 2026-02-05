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

