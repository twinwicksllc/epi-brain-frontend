'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'default' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-t-lg px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60';

const variantStyles: Record<ButtonVariant, string> = {
  default:
    'bg-primary text-white border border-transparent shadow-[0_20px_35px_rgba(123,63,242,0.3)] hover:brightness-110',
  ghost:
    'bg-card/30 text-muted-foreground border border-border hover:text-foreground hover:bg-card/60',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', className = '', ...props }, ref) => (
    <button
      ref={ref}
      type={props.type ?? 'button'}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`.trim()}
      {...props}
    />
  )
);

Button.displayName = 'Button';
