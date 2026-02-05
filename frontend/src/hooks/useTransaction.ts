// Transaction Hook

import { useState, useCallback } from 'react';

import { getTransaction } from '@/services/stacks';

type TxStatus = 'pending' | 'success' | 'failed' | 'idle';

interface UseTransactionResult {
  status: TxStatus;
  txId: string | null;
  checkStatus: (id: string) => Promise<void>;
  reset: () => void;
}

