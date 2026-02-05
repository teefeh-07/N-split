// Badge UI Component

import { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error';
  children: ReactNode;
}

