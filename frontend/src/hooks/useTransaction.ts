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

export function useTransaction(): UseTransactionResult {
  const [status, setStatus] = useState<TxStatus>('idle');
  const [txId, setTxId] = useState<string | null>(null);

  const checkStatus = useCallback(async (id: string) => {
    setTxId(id);
    setStatus('pending');
    try {
      const tx = await getTransaction(id);
      setStatus(tx.tx_status === 'success' ? 'success' : 'failed');
    } catch {
      setStatus('failed');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setTxId(null);
  }, []);

  return { status, txId, checkStatus, reset };
}
