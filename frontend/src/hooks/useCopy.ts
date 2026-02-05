// Copy Hook

import { useState, useCallback } from 'react';

import { copyToClipboard } from '@/lib/utils/clipboard';

interface UseCopyResult {
  copied: boolean;
  copy: (text: string) => Promise<void>;
}

export function useCopy(resetDelay = 2000): UseCopyResult {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelay);
    }
  }, [resetDelay]);

  return { copied, copy };
}
