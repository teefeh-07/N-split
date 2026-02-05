// Chip UI Component

import { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  onRemove?: () => void;
  color?: string;
}

export function Chip({ children, onRemove, color = 'indigo' }: ChipProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-${color}-100 text-${color}-800`}>
      {children}
      {onRemove && (
        <button onClick={onRemove} className="ml-1 hover:text-${color}-600">
          &times;
        </button>
      )}
    </span>
  );
}
