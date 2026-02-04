import { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className = '', ...props }: CardProps) {
  const baseStyles = 'rounded-3xl border border-border bg-card text-foreground shadow-lg';
  return <div className={`${baseStyles} ${className}`.trim()} {...props} />;
}
