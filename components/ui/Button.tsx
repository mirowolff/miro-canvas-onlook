'use client';

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children,
  variant = 'secondary',
  size = 'medium',
  onClick,
  disabled = false,
  className = ''
}: ButtonProps) {
  const baseClasses = `
    button-base
    ${variant === 'primary' ? 'button-primary' : ''}
    ${variant === 'secondary' ? 'button-secondary' : ''}
    ${variant === 'ghost' ? 'button-ghost' : ''}
    ${size === 'small' ? 'button-small' : ''}
    ${size === 'medium' ? 'button-medium' : ''}
    ${size === 'large' ? 'button-large' : ''}
    ${disabled ? 'button-disabled' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <>
      <button
        className={baseClasses}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>

      <style>{`
        .button-base {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          isolation: isolate;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
          gap: 6px;
          flex: none;
          flex-grow: 0;
        }

        .button-base:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        /* Variants */
        .button-primary {
          background: var(--colors-blue500);
          color: var(--colors-white);
        }

        .button-primary:hover:not(:disabled) {
          background: var(--colors-blue550);
        }

        .button-primary:active:not(:disabled) {
          background: var(--colors-blue700);
        }

        .button-secondary {
          background: var(--colors-gray100);
          color: var(--colors-gray900);
        }

        .button-secondary:hover:not(:disabled) {
          background: var(--colors-gray200);
        }

        .button-secondary:active:not(:disabled) {
          background: var(--colors-gray250);
        }

        .button-ghost {
          background: transparent;
          color: var(--colors-gray900);
        }

        .button-ghost:hover:not(:disabled) {
          background: var(--colors-gray100);
        }

        .button-ghost:active:not(:disabled) {
          background: var(--colors-gray200);
        }

        /* Sizes */
        .button-small {
          height: 24px;
          padding: 0px 8px;
          font-size: 12px;
          min-width: 48px;
        }

        .button-medium {
          height: 32px;
          padding: 0px 12px;
          font-size: 14px;
          min-width: 64px;
        }

        .button-large {
          height: 40px;
          padding: 0px 16px;
          font-size: 16px;
          min-width: 80px;
        }

        /* Icon sizing within buttons */
        .button-base svg {
          width: 16px;
          height: 16px;
          fill: currentColor;
          flex-shrink: 0;
        }

        .button-small svg {
          width: 12px;
          height: 12px;
        }

        .button-medium svg {
          width: 16px;
          height: 16px;
        }

        .button-large svg {
          width: 20px;
          height: 20px;
        }
      `}</style>
    </>
  );
}