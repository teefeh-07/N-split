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

