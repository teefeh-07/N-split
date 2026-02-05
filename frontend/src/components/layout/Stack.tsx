// Stack Layout Component

import { ReactNode } from 'react';

interface StackProps {
  children: ReactNode;
  direction?: 'horizontal' | 'vertical';
  gap?: number;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function Stack({ 
  children, 
  direction = 'vertical', 
  gap = 4, 
  align = 'start', 
  className = '' 
}: StackProps) {
  const directionClass = direction === 'horizontal' ? 'flex-row' : 'flex-col';
  const alignClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
  };

  return (
    <div className={`flex ${directionClass} ${alignClass[align]} gap-${gap} ${className}`}>
      {children}
    </div>
  );
}
