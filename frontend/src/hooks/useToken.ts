// Token Hook

import { useState, useCallback } from 'react';

import { openContractCall } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { stringAsciiCV, uintCV, PostConditionMode } from '@stacks/transactions';

interface UseTokenResult {
  createToken: (name: string, symbol: string, supply: number) => Promise<void>;
  isLoading: boolean;
}

