// Card UI Component

import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: CardProps) {
  return <div className={`p-6 border-b border-gray-100 ${className}`} {...props}>{children}</div>;
}

export function CardContent({ className = '', children, ...props }: CardProps) {
  return <div className={`p-6 ${className}`} {...props}>{children}</div>;
}

export function CardFooter({ className = '', children, ...props }: CardProps) {
  return <div className={`p-6 bg-gray-50 rounded-b-xl ${className}`} {...props}>{children}</div>;
}
